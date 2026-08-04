import { prisma } from "../lib/prisma.js";
import type { DownloadType } from "../generated/prisma/client.js";

interface CreateDownloadInput {
	projectId: string;
	storageKey: string;
	type: DownloadType;
	label: string;
	fileSizeBytes?: number;
}

export const downloadRepository = {
	findById(id: string) {
		return prisma.projectDownload.findUnique({ where: { id } });
	},

	findByProjectId(projectId: string) {
		return prisma.projectDownload.findMany({
			where: { projectId },
			orderBy: { createdAt: "desc" },
		});
	},

	create(data: CreateDownloadInput) {
		return prisma.projectDownload.create({ data });
	},

	delete(id: string) {
		return prisma.projectDownload.delete({ where: { id } });
	},

	incrementDownloadCount(id: string) {
		return prisma.projectDownload.update({
			where: { id },
			data: { downloadCount: { increment: 1 } },
		});
	},
};