// Lightweight Gemini client helper
// Tries to dynamically import the @google/generative-ai SDK and call a generative model.
// This helper is forgiving: it attempts a few common SDK shapes and returns a readable string result.

import config from '../config';

let client = null;
let model = null;
let initialized = false;

export async function initGemini() {
    if (initialized) return { client, model };

    const apiKey = config.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('REACT_APP_GEMINI_API_KEY is not set. Please add it to your .env file.');
    }

    try {
        // Dynamic import to avoid build-time errors if package shape differs
        const sdk = await import('@google/generative-ai');

        // Common exported object names
        const GoogleGenerativeAI = sdk.GoogleGenerativeAI || sdk.default || sdk.GoogleAI || sdk;

        // Try to instantiate client
        try {
            client = new GoogleGenerativeAI(apiKey);
        } catch (e) {
            // Some SDKs expect an options object
            try {
                client = new GoogleGenerativeAI({ apiKey });
            } catch (err) {
                // fallback: keep client null and propagate later
                console.warn('Could not instantiate Gemini SDK client with known signatures.', e, err);
                client = null;
            }
        }

        // Try to obtain a model handle in common ways
        if (client) {
            if (typeof client.getGenerativeModel === 'function') {
                model = client.getGenerativeModel({ model: config.model.name });
            } else if (client.models && typeof client.models.get === 'function') {
                model = client.models.get(config.model.name);
            } else if (typeof client.model === 'function') {
                model = client.model(config.model.name);
            } else if (client.getModel && typeof client.getModel === 'function') {
                model = await client.getModel(config.model.name);
            }
        }

        initialized = true;
        return { client, model };
    } catch (err) {
        console.error('Failed to dynamically load @google/generative-ai SDK:', err);
        // Re-throw with guidance
        throw new Error('Failed to initialize Gemini SDK. Ensure @google/generative-ai is installed and that REACT_APP_GEMINI_API_KEY is set. See README for instructions.');
    }
}

// Try multiple known generate call shapes and return text
export async function generateFromPrompt(prompt) {
    await initGemini();

    if (!client && !model) {
        throw new Error('Gemini client/model is not available. Consider using a secure server proxy instead.');
    }

    // Try model.generateContent({ prompt })
    try {
        if (model && typeof model.generateContent === 'function') {
            const res = await model.generateContent({ prompt });
            // common response locations
            return (res?.response?.text) || (res?.output?.text) || (res?.text) || JSON.stringify(res);
        }

        // Try client.generateText or client.generate
        if (client) {
            if (typeof client.generateText === 'function') {
                const res = await client.generateText({ model: config.model.name, prompt });
                return res?.output?.[0]?.content || res?.output || JSON.stringify(res);
            }
            if (typeof client.generate === 'function') {
                const res = await client.generate({ model: config.model.name, prompt });
                return res?.output?.[0]?.content || res?.output || JSON.stringify(res);
            }
        }

        // If SDK has a REST-style method
        if (model && typeof model.generate === 'function') {
            const res = await model.generate({ input: prompt });
            return res?.candidates?.[0]?.output || res?.output || JSON.stringify(res);
        }

        throw new Error('Could not find a supported generate method on the Gemini SDK client/model.');
    } catch (err) {
        console.error('Gemini generate error:', err);
        // Wrap error for upstream handling
        throw new Error('Gemini generate failed: ' + (err.message || String(err)));
    }
}
