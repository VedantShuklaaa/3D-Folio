import { mediaRepository } from "../repositories/media.repository.js";
import { projectRepository } from "../repositories/project.repository.js";
import { ApiError } from "../utils/apiError.js";
import type { MediaType } from "../generated/prisma/client.js";

interface CreateMediaDTO {
	projectId: string;
	storageKey: string;
	type: MediaType;
	fileName: string;
	title?: string;
	altText?: string;
	order?: number;
}

export const mediaService = {
	async createMedia(data: CreateMediaDTO) {
		const project = await projectRepository.findById(data.projectId);
		if (!project) {
			throw ApiError.notFound("Project not found");
		}

		if (!data.storageKey.startsWith(`projects/${data.projectId}/media/`)) {
			throw ApiError.badRequest("storageKey does not match the expected project path");
		}

		return mediaRepository.create(data);
	},

	async deleteMedia(id: string) {
		const existing = await mediaRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Media not found");
		}

		return mediaRepository.delete(id);
	},
};