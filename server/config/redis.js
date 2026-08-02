const Redis = require("ioredis");
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;

let redis = null;

if (redisUrl) {

    redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
        retryStrategy: (times) => {
            if (times > 3) {
                return null;
            }
            return Math.min(times * 500, 2000);
        }
    });

    redis.on("error", (error) => {
        console.error("[Redis] Connection Error:", error.message);
    });

    redis.on("connect", () => {
        console.log("[Redis] Connected");
    });

    redis.on("close", () => {
        console.warn("[Redis] Connection Closed");
    });

    redis.connect().catch((error) => {
        console.error("[Redis] Connection Failed:", error.message);
    });

}

module.exports = redis;
