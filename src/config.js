// Environment variable configuration
console.log('Available environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    // Don't log the full API key, just check if it exists
    HAS_GEMINI_KEY: !!process.env.REACT_APP_GEMINI_API_KEY,
    ALL_ENV: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
});

const config = {
    GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || '',

    // Validate environment setup
    isConfigValid: () => {
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('REACT_APP_GEMINI_API_KEY is missing in environment');
            return false;
        }
        if (apiKey === 'your-api-key-here') {
            console.error('Please replace the placeholder API key in .env with your actual Gemini API key');
            return false;
        }
        return true;
    },

    // AI model configuration
    model: {
        name: 'gemini-pro',  // Gemini's most capable model
        temperature: 0.7,
        maxTokens: 2048,     // Gemini allows larger responses
        topK: 40,
        topP: 0.95,
        maxRetries: 3
    },
    // API configuration
    api: {
        baseURL: 'https://generativelanguage.googleapis.com',
        timeout: 30000, // 30 seconds
        retryDelay: 1000, // 1 second
        rateLimitPerMin: 60 // Gemini's free tier is more generous
    },
    // Monitoring configuration
    monitoring: {
        enabled: true,
        tokenUsageWarningThreshold: 80, // Warn at 80% of quota
        quotaLimit: 3000000, // Free tier token limit per month
        storage: {
            key: 'openai_usage_stats',
            quotaResetDay: 1, // Quota resets on 1st of each month
            errorHistoryLimit: 100 // Maximum number of errors to store
        },
        retryStrategy: {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 5000,
            backoffMultiplier: 2
        },
        alerts: {
            quotaThresholds: [50, 80, 90, 95], // Percentage thresholds for quota alerts
            errorRateThreshold: 10, // Alert if error rate exceeds 10%
            consecutiveFailures: 5 // Alert after 5 consecutive failures
        },
        performance: {
            trackLatency: true,
            slowRequestThreshold: 5000, // ms
            timeoutThreshold: 30000 // ms
        }
    }
};

// Validate environment variables
const validateConfig = () => {
    const missing = [];

    if (!config.GEMINI_API_KEY) {
        missing.push('REACT_APP_GEMINI_API_KEY');
    }

    if (missing.length > 0) {
        console.error('Missing environment variables:', missing.join(', '));
        return false;
    }

    return true;
};

// Run validation
validateConfig();

export default config;