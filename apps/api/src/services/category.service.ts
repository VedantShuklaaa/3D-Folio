import { categoryRepository } from "../repositories/category.repository.js";
import { ApiError } from "../utils/apiError.js";
import { generateSlug } from "../utils/slug.js";

interface CreateCategoryDTO {
	name: string;
	description?: string;
}

interface UpdateCategoryDTO {
	name?: string;
	description?: string;
}

export const categoryService = {
	async createCategory(data: CreateCategoryDTO) {
		const existingName = await categoryRepository.findByName(data.name);
		if (existingName) {
			throw ApiError.conflict("A category with this name already exists");
		}

		const slug = generateSlug(data.name);
		const existingSlug = await categoryRepository.findBySlug(slug);
		if (existingSlug) {
			throw ApiError.conflict("A category with a similar name already exists");
		}

		return categoryRepository.create({ ...data, slug });
	},

	async listCategories() {
		return categoryRepository.findMany();
	},

	async updateCategory(id: string, data: UpdateCategoryDTO) {
		const existing = await categoryRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Category not found");
		}

		if (data.name && data.name !== existing.name) {
			const existingName = await categoryRepository.findByNameExcludingId(data.name, id);
			if (existingName) {
				throw ApiError.conflict("A category with this name already exists");
			}
		}

		let slug: string | undefined;
		if (data.name && data.name !== existing.name) {
			slug = generateSlug(data.name);
			const existingSlug = await categoryRepository.findBySlugExcludingId(slug, id);
			if (existingSlug) {
				throw ApiError.conflict("A category with a similar name already exists");
			}
		}

		return categoryRepository.update(id, { ...data, ...(slug && { slug }) });
	},

	async deleteCategory(id: string) {
		const existing = await categoryRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Category not found");
		}

		const projectCount = await categoryRepository.countProjectsInCategory(id);
		if (projectCount > 0) {
			throw ApiError.badRequest(
				`Cannot delete category with ${projectCount} project(s) still assigned to it`
			);
		}

		return categoryRepository.delete(id);
	},
};