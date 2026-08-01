import { projectRepository } from "../repositories/project.repository.js";
import { ApiError } from "../utils/apiError.js";
import type { Visibility } from "../generated/prisma/client.js";
import { generateSlug } from "../utils/slug.js";

interface CreateProjectDTO {
	title: string;
	shortDescription?: string;
	description?: string;
	featured?: boolean;
	published?: boolean;
	visibility?: Visibility;
	categoryId?: string;
	technologyIds?: string[];
}

interface UpdateProjectDTO {
	title?: string;
	shortDescription?: string;
	description?: string;
	featured?: boolean;
	published?: boolean;
	visibility?: Visibility;
	categoryId?: string;
	technologyIds?: string[];
}

interface ListProjectsParams {
	page: number;
	limit: number;
	categoryId?: string;
	featured?: boolean;
	published?: boolean;
	search?: string;
}

export const projectService = {
	async createProject(data: CreateProjectDTO, createdBy: string) {
		const slug = generateSlug(data.title);

		const existing = await projectRepository.findBySlug(slug);
		if (existing) {
			throw ApiError.conflict("A project with a similar title already exists");
		}

		return projectRepository.create({ ...data, slug, createdBy });
	},

	async listProjects(params: ListProjectsParams) {
		const { page, limit, ...filters } = params;
		const skip = (page - 1) * limit;

		const [projects, total] = await Promise.all([
			projectRepository.findMany({ ...filters, skip, take: limit }),
			projectRepository.count(filters),
		]);

		return {
			projects,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	},

	async getProjectBySlug(slug: string) {
		const project = await projectRepository.findBySlug(slug);

		if (!project) {
			throw ApiError.notFound("Project not found");
		}

		return project;
	},

	async updateProject(id: string, data: UpdateProjectDTO) {
		const existing = await projectRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Project not found");
		}

		let slug: string | undefined;
		if (data.title && data.title !== existing.title) {
			slug = generateSlug(data.title);
			const conflict = await projectRepository.findBySlugExcludingId(slug, id);
			if (conflict) {
				throw ApiError.conflict("A project with a similar title already exists");
			}
		}

		return projectRepository.update(
			id,
			{ ...data, ...(slug && { slug }) },
			existing.published
		);
	},

	async deleteProject(id: string) {
		const existing = await projectRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Project not found");
		}

		return projectRepository.delete(id);
	},
};