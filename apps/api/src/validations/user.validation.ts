import { z } from "zod";

export const searchUsersSchema = z.object({
	query: z.object({
		search: z.string().optional(),
		page: z.coerce.number().int().positive().default(1),
		limit: z.coerce.number().int().positive().max(100).default(20),
	}),
});

export const updateRoleSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
	body: z.object({
		role: z.enum(["ADMIN", "HELPER", "USER"]),
	}),
});

export const updateActiveSchema = z.object({
	params: z.object({
		id: z.string().min(1),
	}),
	body: z.object({
		isActive: z.boolean(),
	}),
});