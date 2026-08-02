import type { Request, Response } from "express";
import { categoryService } from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
	const body = req.body as { name: string; description?: string };

	const category = await categoryService.createCategory(body);

	res.status(201).json({ success: true, data: category });
});

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
	const categories = await categoryService.listCategories();

	res.status(200).json({ success: true, data: categories });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing category id");

	const body = req.body as { name?: string; description?: string };

	const category = await categoryService.updateCategory(id, body);

	res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing category id");

	const force = req.query.force === "true";

	await categoryService.deleteCategory(id, force);

	res.status(204).send();
});