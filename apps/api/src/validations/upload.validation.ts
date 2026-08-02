import { z } from "zod";

export const presignUploadSchema = z.object({
	body: z.object({
		projectId: z.string().min(1),
		fileName: z.string().min(1).max(255),
		contentType: z.string().min(1),
	}),
});