import type { Request, Response } from "express";
import { projectService } from "../services/project.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import type { Visibility } from "../generated/prisma/client.js";
import { toProjectDetailDTO, toProjectListDTO } from "../types/project.js";

function isStaff(user: Request["user"]) {
	return user?.role === "ADMIN" || user?.role === "HELPER";
}

export const createProject = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) throw ApiError.unauthorized("Not authenticated");

	const body = req.body as {
		title: string;
		shortDescription?: string;
		description?: string;
		featured?: boolean;
		published?: boolean;
		visibility?: Visibility;
		categoryId?: string;
		technologyIds?: string[];
	};

	const project = await projectService.createProject(body, req.user.id);

	res.status(201).json({ success: true, data: toProjectDetailDTO(project) });
});

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
	const query = req.query as unknown as {
		page: number;
		limit: number;
		categoryId?: string;
		featured?: boolean;
		published?: boolean;
		search?: string;
	};

	const staff = isStaff(req.user);

	const result = await projectService.listProjects(query, staff);

	res.status(200).json({
		success: true,
		data: {
			projects: result.projects.map(toProjectListDTO),
			pagination: result.pagination,
		},
	});
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
	const { slug } = req.params;
	if (!slug || typeof slug !== "string") throw ApiError.badRequest("Missing slug");

	const staff = isStaff(req.user);

	const project = await projectService.getProjectBySlug(slug, staff);

	res.status(200).json({ success: true, data: toProjectDetailDTO(project) });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) throw ApiError.unauthorized("Not authenticated");

	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing project id");

	const body = req.body as {
		title?: string;
		shortDescription?: string;
		description?: string;
		featured?: boolean;
		published?: boolean;
		visibility?: Visibility;
		categoryId?: string;
		technologyIds?: string[];
	};

	const project = await projectService.updateProject(id, body);

	res.status(200).json({ success: true, data: toProjectDetailDTO(project) });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) throw ApiError.unauthorized("Not authenticated");

	const { id } = req.params;
	if (!id || typeof id !== "string") throw ApiError.badRequest("Missing project id");

	await projectService.deleteProject(id);

	res.status(204).send();
});