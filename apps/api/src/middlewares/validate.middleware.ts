import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/apiError.js";

export function validate(schema: ZodType) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		if (!result.success) {
			throw ApiError.badRequest("Validation failed", result.error.flatten());
		}

		const parsed = result.data as { body?: unknown; query?: unknown; params?: unknown };

		if (parsed.body !== undefined) req.body = parsed.body;
		if (parsed.query !== undefined) Object.assign(req.query, parsed.query);
		if (parsed.params !== undefined) Object.assign(req.params, parsed.params);

		next();
	};
}