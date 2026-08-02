import type { Request, Response } from "express";
import { mediaService } from "../services/media.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import type { MediaType } from "../generated/prisma/client.js";

export const createMedia = asyncHandler(async (req: Request, res: Response) => {
	const body = req.body as {
		projectId: string;
		storageKey: string;
		type: MediaType;
		fileName: string;
		title?: string;
		altText?: string;
		order?: number;
	};

	const media = await mediaService.createMedia(body);

	res.status(201).json({ success: true, data: media });
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing media id");

	await mediaService.deleteMedia(id);

	res.status(204).send();
});