import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const globalForRedis = globalThis as unknown as {
	redis: Redis | undefined;
};

export const redis =
	globalForRedis.redis ??
	new Redis(env.REDIS_URL, {
		maxRetriesPerRequest: 3,
	});

redis.on("error", (err: Error) =>
	logger.error({ err }, "Redis connection error")
);
redis.on("connect", () => logger.info("Redis connected"));

if (env.NODE_ENV !== "production") {
	globalForRedis.redis = redis;
}