import { downloadRepository } from "../repositories/download.repository.js";
import { projectRepository } from "../repositories/project.repository.js";
import { ApiError } from "../utils/apiError.js";
import type { DownloadType } from "../generated/prisma/client.js";
import { getSignedDownloadUrl } from "../lib/aws/cloudfront.js";
import { storageService } from "./storage.service.js";

interface CreateDownloadDTO {
	storageKey: string;
	type: DownloadType;
	label: string;
	fileSizeBytes?: number;
}

export const downloadService = {
	async createDownload(projectId: string, data: CreateDownloadDTO) {
		const project = await projectRepository.findById(projectId);
		if (!project) {
			throw ApiError.notFound("Project not found");
		}

		if (!data.storageKey.startsWith(`projects/${projectId}/downloads/`)) {
			throw ApiError.badRequest("storageKey does not match the expected project path");
		}

		return downloadRepository.create({ ...data, projectId });
	},

	async listDownloads(projectId: string) {
		const project = await projectRepository.findById(projectId);
		if (!project) {
			throw ApiError.notFound("Project not found");
		}

		return downloadRepository.findByProjectId(projectId);
	},

	async deleteDownload(id: string) {
		const existing = await downloadRepository.findById(id);
		if (!existing) {
			throw ApiError.notFound("Download not found");
		}

		await storageService.delete(existing.storageKey);
		return downloadRepository.delete(id);
	},

	async getSignedUrlAndTrack(id: string) {
		const download = await downloadRepository.findById(id);
		if (!download) throw ApiError.notFound("Download not found");

		await downloadRepository.incrementDownloadCount(id);

		return { url: getSignedDownloadUrl(download.storageKey) };
	},
};

