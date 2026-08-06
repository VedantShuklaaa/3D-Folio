import type { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis.js";
import { logger } from "../config/logger.js";

export function cacheResponse(ttlSeconds: number) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const key = `cache:${req.originalUrl}`;

		try {
			const cached = await redis.get(key);
			if (cached) {
				res.setHeader("X-Cache", "HIT");
				res.status(200).json(JSON.parse(cached));
				return;
			}
		} catch (err) {
			logger.error({ err }, "Redis cache read failed, falling through to DB");
		}

		const originalJson = res.json.bind(res);
		res.json = (body: unknown) => {
			if (res.statusCode === 200) {
				redis.set(key, JSON.stringify(body), "EX", ttlSeconds).catch((err) => {
					logger.error({ err }, "Redis cache write failed");
				});
			}
			res.setHeader("X-Cache", "MISS");
			return originalJson(body);
		};

		next();
	};
}