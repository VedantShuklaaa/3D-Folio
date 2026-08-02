import { z } from "zod";

export const createMediaSchema = z.object({
	body: z.object({
		projectId: z.string().min(1),
		storageKey: z.string().min(1),
		type: z.enum(["IMAGE", "VIDEO", "MODEL_3D"]),
		fileName: z.string().min(1),
		title: z.string().max(200).optional(),
		altText: z.string().max(300).optional(),
		order: z.number().int().min(0).optional(),
	}),
});

export const deleteMediaSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
});