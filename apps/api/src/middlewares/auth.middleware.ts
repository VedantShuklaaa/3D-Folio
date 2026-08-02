import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userRepository } from "../repositories/user.repository.js";
import { verifySessionToken } from "../config/session.js";

export function errorMiddleware(
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err instanceof ApiError) {
		if (!err.isOperational) {
			logger.error(err);
		}
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
			...(err.details ? { details: err.details } : {}),
			...(env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
		});
	}

	logger.error({
		err,
		method: req.method,
		url: req.originalUrl,
		ip: req.ip,
	});

	const message =
		err instanceof Error
			? err.message
			: "Internal server error";

	const stack =
		err instanceof Error
			? err.stack
			: undefined;

	return res.status(500).json({
		success: false,
		message,
		...(env.NODE_ENV !== "production" && stack
			? { stack }
			: {}),
	});
}


export const requireAuth = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies?.session;

		if (!token) {
			throw ApiError.unauthorized("Not authenticated");
		}

		const payload = verifySessionToken(token);

		if (!payload) {
			throw ApiError.unauthorized("Session expired or invalid");
		}

		const user = await userRepository.findById(payload.userId);

		if (!user) {
			throw ApiError.unauthorized("User not found");
		}

		if (!user.isActive) {
			throw ApiError.forbidden("Account is deactivated");
		}

		req.user = user;
		next();
	}
);


export const optionalAuth = asyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		const token = req.cookies?.session;
		if (!token) return next();

		const payload = verifySessionToken(token);
		if (!payload) return next();

		const user = await userRepository.findById(payload.userId);
		if (user?.isActive) req.user = user;

		next();
	}
);