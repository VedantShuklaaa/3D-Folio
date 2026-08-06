import { redis } from "../lib/redis.js";
import { logger } from "../config/logger.js";

export async function invalidateCachePattern(pattern: string) {
	try {
		const keys = await redis.keys(pattern);
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	} catch (err) {
		logger.error({ err, pattern }, "Cache invalidation failed");
	}
}