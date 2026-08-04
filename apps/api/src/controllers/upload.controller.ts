import type { Request, Response } from "express";
import { uploadService } from "../services/upload.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { UploadKind } from "../types/upload.js";

export const presignUpload = asyncHandler(async (req: Request, res: Response) => {
	const { projectId, fileName, contentType, kind } = req.body as {
		projectId: string;
		fileName: string;
		contentType: string;
		kind: UploadKind,
	};

	try {
		const result = await uploadService.createPresignedUploadUrl({
			projectId,
			fileName,
			contentType,
			kind,
		});

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (e) {
		if (e instanceof Error) throw ApiError.badRequest(e.message);
		throw e;
	}
});