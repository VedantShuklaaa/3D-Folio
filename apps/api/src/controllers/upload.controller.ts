import type { Request, Response } from "express";
import { uploadService } from "../services/upload.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const presignUpload = asyncHandler(async (req: Request, res: Response) => {
	const { projectId, fileName, contentType } = req.body as {
		projectId: string;
		fileName: string;
		contentType: string;
	};

	try {
		const result = await uploadService.createPresignedUploadUrl({ projectId, fileName, contentType });
		res.status(200).json({ success: true, data: result });
	} catch (e) {
		if (e instanceof Error) throw ApiError.badRequest(e.message);
		throw e;
	}
});