import type { Request, Response } from "express";
import { downloadService } from "../services/download.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import type { DownloadType } from "../generated/prisma/client.js";

export const createDownload = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing project id");

	const body = req.body as {
		storageKey: string;
		type: DownloadType;
		label: string;
		fileSizeBytes?: number;
	};

	const download = await downloadService.createDownload(id, body);

	res.status(201).json({ success: true, data: download });
});

export const listDownloads = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing project id");

	const downloads = await downloadService.listDownloads(id);

	res.status(200).json({ success: true, data: downloads });
});

export const deleteDownload = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing download id");

	await downloadService.deleteDownload(id);

	res.status(204).send();
});