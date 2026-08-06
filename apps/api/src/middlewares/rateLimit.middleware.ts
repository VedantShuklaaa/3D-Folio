import { RateLimiterRedis } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis.js";
import { ApiError } from "../utils/apiError.js";

const limiter = new RateLimiterRedis({
	storeClient: redis,
	keyPrefix: "ratelimit",
	points: 100,
	duration: 60,
});

export async function rateLimit(req: Request, res: Response, next: NextFunction) {
	try {
		await limiter.consume(req.ip ?? "unknown");
		next();
	} catch {
		throw ApiError.badRequest("Too many requests, please try again later");
	}
}