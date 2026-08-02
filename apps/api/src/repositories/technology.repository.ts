import { prisma } from "../lib/prisma.js";

interface CreateTechnologyInput {
	name: string;
	icon?: string;
	website?: string;
}

interface UpdateTechnologyInput {
	name?: string;
	icon?: string;
	website?: string;
}

export const technologyRepository = {
	findById(id: string) {
		return prisma.technology.findUnique({ where: { id } });
	},

	findByName(name: string) {
		return prisma.technology.findUnique({ where: { name } });
	},

	findByNameExcludingId(name: string, excludeId: string) {
		return prisma.technology.findFirst({ where: { name, NOT: { id: excludeId } } });
	},

	countProjectsUsingTechnology(id: string) {
		return prisma.project.count({ where: { technologies: { some: { id } } } });
	},

	findMany() {
		return prisma.technology.findMany({ orderBy: { name: "asc" } });
	},

	create(data: CreateTechnologyInput) {
		return prisma.technology.create({ data });
	},

	update(id: string, data: UpdateTechnologyInput) {
		return prisma.technology.update({ where: { id }, data });
	},

	delete(id: string) {
		return prisma.technology.delete({ where: { id } });
	},
};