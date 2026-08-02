const redis = require("../config/redis");

const cache = (key, ttl) => {

    return async (req, res, next) => {

        if (!redis) {

            return next();

        }

        try {

            const cached = await redis.get(key);

            if (cached) {

                console.log(`[Cache] HIT ${key}`);

                return res.status(200).json(JSON.parse(cached));

            }

            const originalJson = res.json.bind(res);

            res.json = (body) => {

                if (res.statusCode >= 200 && res.statusCode < 300) {

                    redis.set(key, JSON.stringify(body), "EX", ttl)
                        .then(() => console.log(`[Cache] SET ${key}`))
                        .catch((error) => console.error("[Cache] SET Error:", error.message));

                }

                return originalJson(body);

            };

            next();

        } catch (error) {

            console.error("[Cache] GET Error:", error.message);

            return next();

        }

    };

};

const invalidateCache = async (keys) => {

    if (!redis) {

        return;

    }

    try {

        await redis.del(...keys);

        console.log(`[Cache] INVALIDATED ${keys.join(", ")}`);

    } catch (error) {

        console.error("[Cache] DELETE Error:", error.message);

    }

};

module.exports = {
    cache,
    invalidateCache
};
