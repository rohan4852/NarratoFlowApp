import config from '../config';

class APIMonitoring {
    constructor() {
        this.usageStats = this.loadUsageStats();
        this.requestTimestamps = [];
    }

    // Load usage statistics from localStorage
    loadUsageStats() {
        const stats = localStorage.getItem(config.monitoring.storage.key);
        if (stats) {
            const parsedStats = JSON.parse(stats);
            // Reset if it's a new month
            if (this.shouldResetQuota(parsedStats.lastReset)) {
                return this.initializeUsageStats();
            }
            return parsedStats;
        }
        return this.initializeUsageStats();
    }

    // Initialize new usage statistics
    initializeUsageStats() {
        const stats = {
            tokenUsage: 0,
            requestCount: 0,
            successCount: 0,
            failureCount: 0,
            errors: [],
            errorCategories: {
                rateLimit: 0,
                quota: 0,
                auth: 0,
                server: 0,
                network: 0,
                other: 0
            },
            lastReset: new Date().toISOString(),
        };
        this.saveUsageStats(stats);
        return stats;
    }

    // Save usage statistics to localStorage
    saveUsageStats(stats) {
        localStorage.setItem(config.monitoring.storage.key, JSON.stringify(stats));
    }

    // Check if quota should be reset (new month)
    shouldResetQuota(lastReset) {
        const resetDate = new Date(lastReset);
        const now = new Date();
        return resetDate.getMonth() !== now.getMonth() || resetDate.getYear() !== now.getYear();
    }

    // Track token usage
    trackTokenUsage(tokens) {
        this.usageStats.tokenUsage += tokens;
        this.usageStats.requestCount += 1;
        this.saveUsageStats(this.usageStats);

        // Check if approaching quota limit
        const usagePercentage = (this.usageStats.tokenUsage / config.monitoring.quotaLimit) * 100;
        if (usagePercentage >= config.monitoring.tokenUsageWarningThreshold) {
            console.warn(`Warning: Token usage at ${usagePercentage.toFixed(1)}% of monthly quota`);
            return { warning: true, usagePercentage };
        }
        return { warning: false, usagePercentage };
    }

    // Check rate limits
    checkRateLimit() {
        const now = Date.now();
        // Remove timestamps older than 1 minute
        this.requestTimestamps = this.requestTimestamps.filter(
            timestamp => now - timestamp < 60000
        );

        // Check if we're within rate limits
        if (this.requestTimestamps.length >= config.api.rateLimitPerMin) {
            const oldestRequest = this.requestTimestamps[0];
            const timeToWait = 60000 - (now - oldestRequest);
            return {
                allowed: false,
                timeToWait,
                message: `Rate limit exceeded. Please wait ${Math.ceil(timeToWait / 1000)} seconds.`
            };
        }

        // Add current timestamp and allow request
        this.requestTimestamps.push(now);
        return { allowed: true };
    }

    // Handle retries with exponential backoff
    async retryWithBackoff(operation, context = {}) {
        const { maxAttempts, initialDelay, maxDelay, backoffMultiplier } = config.monitoring.retryStrategy;
        let attempt = 0;
        let delay = initialDelay;

        while (attempt < maxAttempts) {
            try {
                return await operation();
            } catch (error) {
                attempt++;
                if (attempt === maxAttempts) throw error;

                // Handle specific error types
                if (error.message.includes('Rate limit')) {
                    console.warn(`Rate limit hit, waiting ${delay}ms before retry ${attempt}`);
                } else if (error.message.includes('insufficient_quota')) {
                    throw new Error('Monthly quota exceeded. Please upgrade your plan.');
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay));
                delay = Math.min(delay * backoffMultiplier, maxDelay);
            }
        }
    }

    // Track request outcome
    trackRequestOutcome(success, error = null) {
        if (success) {
            this.usageStats.successCount += 1;
        } else {
            this.usageStats.failureCount += 1;
            if (error) {
                this.categorizeError(error);
            }
        }
        this.saveUsageStats(this.usageStats);
    }

    // Categorize and track errors
    categorizeError(error) {
        if (error.message.includes('Rate limit')) {
            this.usageStats.errorCategories.rateLimit += 1;
        } else if (error.message.includes('insufficient_quota')) {
            this.usageStats.errorCategories.quota += 1;
        } else if (error.response?.status === 401) {
            this.usageStats.errorCategories.auth += 1;
        } else if (error.response?.status >= 500) {
            this.usageStats.errorCategories.server += 1;
        } else if (error.message.includes('Network Error')) {
            this.usageStats.errorCategories.network += 1;
        } else {
            this.usageStats.errorCategories.other += 1;
        }
    }

    // Get current usage statistics
    getUsageStats() {
        const stats = {
            ...this.usageStats,
            remainingQuota: config.monitoring.quotaLimit - this.usageStats.tokenUsage,
            usagePercentage: (this.usageStats.tokenUsage / config.monitoring.quotaLimit) * 100,
            successRate: this.usageStats.requestCount > 0
                ? (this.usageStats.successCount / this.usageStats.requestCount) * 100
                : 100,
            recentErrors: this.usageStats.errors.slice(-5), // Last 5 errors
            errorBreakdown: this.usageStats.errorCategories
        };

        // Add rate limit status
        const rateLimitStatus = this.checkRateLimit();
        stats.rateLimitStatus = {
            currentRequests: this.requestTimestamps.length,
            maxRequests: config.api.rateLimitPerMin,
            isLimited: !rateLimitStatus.allowed,
            timeToReset: rateLimitStatus.timeToWait || 0
        };

        return stats;
    }

    // Log error with context
    logError(error, context = {}) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.message,
            context,
        };
        this.usageStats.errors.push(errorLog);
        this.saveUsageStats(this.usageStats);
        console.error('API Error:', errorLog);
    }
}

export const apiMonitoring = new APIMonitoring();
