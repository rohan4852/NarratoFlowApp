export const generateStory = async (data: any): Promise<string> => {
    // Implement AI logic to generate a story based on the provided data
    const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to generate story');
    }

    const result = await response.json();
    return result.story;
};

export const analyzeSentiment = async (text: string): Promise<string> => {
    // Implement AI logic to analyze sentiment of the provided text
    const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
    }

    const result = await response.json();
    return result.sentiment;
};