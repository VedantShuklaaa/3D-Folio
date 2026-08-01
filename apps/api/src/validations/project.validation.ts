import { z } from "zod";

const technologyIds = z.array(z.string().min(1)).optional();

export const createProjectSchema = z.object({
	body: z.object({
		title: z.string().min(1).max(200),
		shortDescription: z.string().max(300).optional(),
		description: z.string().optional(),
		featured: z.boolean().optional(),
		published: z.boolean().optional(),
		visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
		categoryId: z.string().min(1).optional(),
		technologyIds,
	}),
});

export const updateProjectSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
	body: z.object({
		title: z.string().min(1).max(200).optional(),
		shortDescription: z.string().max(300).optional(),
		description: z.string().optional(),
		featured: z.boolean().optional(),
		published: z.boolean().optional(),
		visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
		categoryId: z.string().min(1).optional(),
		technologyIds,
	}),
});

export const listProjectsSchema = z.object({
	query: z.object({
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
		categoryId: z.string().optional(),
		featured: z.coerce.boolean().optional(),
		published: z.coerce.boolean().optional(),
		search: z.string().optional(),
	}),
});

export const getProjectBySlugSchema = z.object({
	params: z.object({
		slug: z.string().min(1),
	}),
});

export const deleteProjectSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
});