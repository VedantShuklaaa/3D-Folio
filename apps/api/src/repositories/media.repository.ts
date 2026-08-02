import { prisma } from "../lib/prisma.js";
import type { MediaType } from "../generated/prisma/client.js";

interface CreateMediaInput {
	projectId: string;
	storageKey: string;
	type: MediaType;
	fileName: string;
	title?: string;
	altText?: string;
	order?: number;
}

export const mediaRepository = {
	findById(id: string) {
		return prisma.projectMedia.findUnique({ where: { id } });
	},

	create(data: CreateMediaInput) {
		return prisma.projectMedia.create({ data });
	},

	delete(id: string) {
		return prisma.projectMedia.delete({ where: { id } });
	},
};