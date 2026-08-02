import { technologyRepository } from "../repositories/technology.repository.js";
import { ApiError } from "../utils/apiError.js";

interface CreateTechnologyDTO {
	name: string;
	icon?: string;
	website?: string;
}

interface UpdateTechnologyDTO {
	name?: string;
	icon?: string;
	website?: string;
}

export const technologyService = {
	async createTechnology(data: CreateTechnologyDTO) {
		const existing = await technologyRepository.findByName(data.name);
		if (existing) {
			throw ApiError.conflict("A technology with this name already exists");
		}

		return technologyRepository.create(data);
	},

	async listTechnologies() {
		return technologyRepository.findMany();
	},

	async updateTechnology(id: string, data: UpdateTechnologyDTO) {
		const existing = await technologyRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Technology not found");
		}

		if (data.name && data.name !== existing.name) {
			const nameConflict = await technologyRepository.findByNameExcludingId(data.name, id);
			if (nameConflict) {
				throw ApiError.conflict("A technology with this name already exists");
			}
		}

		return technologyRepository.update(id, data);
	},

	async deleteTechnology(id: string, force: boolean) {
		const existing = await technologyRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Technology not found");
		}

		const projectCount = await technologyRepository.countProjectsUsingTechnology(id);

		if (projectCount > 0 && !force) {
			throw ApiError.conflict(
				`This technology is attached to ${projectCount} project(s). Pass force=true to delete anyway.`,
				{ projectCount, requiresConfirmation: true }
			);
		}

		return technologyRepository.delete(id);
	},
};