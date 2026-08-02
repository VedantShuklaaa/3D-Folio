import type { Request, Response } from "express";
import { technologyService } from "../services/technology.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const createTechnology = asyncHandler(async (req: Request, res: Response) => {
	const body = req.body as { name: string; icon?: string; website?: string };

	const technology = await technologyService.createTechnology(body);

	res.status(201).json({ success: true, data: technology });
});

export const listTechnologies = asyncHandler(async (req: Request, res: Response) => {
	const technologies = await technologyService.listTechnologies();

	res.status(200).json({ success: true, data: technologies });
});

export const updateTechnology = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing technology id");

	const body = req.body as { name?: string; icon?: string; website?: string };

	const technology = await technologyService.updateTechnology(id, body);

	res.status(200).json({ success: true, data: technology });
});

export const deleteTechnology = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing technology id");

	const force = req.query.force === "true";

	await technologyService.deleteTechnology(id, force);

	res.status(204).send();
});