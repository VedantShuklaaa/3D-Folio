import { z } from "zod";

export const createTechnologySchema = z.object({
	body: z.object({
		name: z.string().min(1).max(100),
		icon: z.string().max(500).optional(),
		website: z.url().optional(),
	}),
});

export const updateTechnologySchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
	body: z.object({
		name: z.string().min(1).max(100).optional(),
		icon: z.string().max(500).optional(),
		website: z.url().optional(),
	}),
});

export const deleteTechnologySchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
	query: z.object({
		force: z.coerce.boolean().optional().default(false),
	}),
});