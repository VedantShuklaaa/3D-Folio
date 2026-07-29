import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import type { Role } from "../generated/prisma/client.js";

export function requireRole(...allowedRoles: Role[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			throw ApiError.unauthorized("Not authenticated");
		}

		if (!allowedRoles.includes(req.user.role)) {
			throw ApiError.forbidden("Insufficient permissions");
		}

		next();
	};
}