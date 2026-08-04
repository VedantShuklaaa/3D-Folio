import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import type { Role } from "../generated/prisma/client.js";

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
	const { search, page, limit } = req.query as unknown as {
		search?: string;
		page: number;
		limit: number;
	};

	const result = await userService.searchUsers({ ...(search && { search }), page, limit });

	res.status(200).json({ success: true, data: result });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) throw ApiError.unauthorized("Not authenticated");

	const { id } = req.params;
	if (!id || typeof id !== "string") {
		throw ApiError.badRequest("Missing or invalid user id");
	}

	const { role } = req.body as { role: Role };

	const user = await userService.updateUserRole(id, role, req.user.id);

	res.status(200).json({ success: true, data: user });
});

export const updateUserActive = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) throw ApiError.unauthorized("Not authenticated");

	const { id } = req.params;
	if (!id || typeof id !== "string") {
		throw ApiError.badRequest("Missing or invalid user id");
	}

	const { isActive } = req.body as { isActive: boolean };

	const user = await userService.updateUserActive(id, isActive, req.user.id);

	res.status(200).json({ success: true, data: user });
});