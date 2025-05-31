// Environment variable configuration
const config = {
    OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    // AI model configuration
    model: {
        name: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
        presencePenalty: 0.1,
        frequencyPenalty: 0.1,
        maxRetries: 3
    },
    // API configuration
    api: {
        baseURL: 'https://api.openai.com/v1',
        timeout: 30000, // 30 seconds
        retryDelay: 1000, // 1 second
        rateLimitPerMin: 50 // Safe limit for free tier
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

    if (!config.OPENAI_API_KEY) {
        missing.push('REACT_APP_OPENAI_API_KEY');
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