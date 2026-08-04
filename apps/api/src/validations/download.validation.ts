import { z } from "zod";

const downloadTypes = z.enum([
	"BLEND",
	"TEXTURE",
	"HDRI",
	"MATERIAL",
	"ADDON",
	"DOCUMENTATION",
	"LICENSE",
	"OTHER",
]);

export const createDownloadSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
	body: z.object({
		storageKey: z.string().min(1),
		type: downloadTypes,
		label: z.string().min(1).max(200),
		fileSizeBytes: z.number().int().positive().optional(),
	}),
});

export const listDownloadsSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
});

export const deleteDownloadSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
});