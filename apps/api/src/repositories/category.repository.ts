import { prisma } from "../lib/prisma.js";

interface CreateCategoryInput {
	name: string;
	slug: string;
	description?: string;
}

interface UpdateCategoryInput {
	name?: string;
	slug?: string;
	description?: string;
}

export const categoryRepository = {
	findById(id: string) {
		return prisma.category.findUnique({ where: { id } });
	},

	findBySlug(slug: string) {
		return prisma.category.findUnique({ where: { slug } });
	},

	findByName(name: string) {
		return prisma.category.findUnique({ where: { name } });
	},

	findBySlugExcludingId(slug: string, excludeId: string) {
		return prisma.category.findFirst({ where: { slug, NOT: { id: excludeId } } });
	},

	findByNameExcludingId(name: string, excludeId: string) {
		return prisma.category.findFirst({ where: { name, NOT: { id: excludeId } } });
	},

	findMany() {
		return prisma.category.findMany({ orderBy: { name: "asc" } });
	},

	create(data: CreateCategoryInput) {
		return prisma.category.create({ data });
	},

	update(id: string, data: UpdateCategoryInput) {
		return prisma.category.update({ where: { id }, data });
	},

	delete(id: string) {
		return prisma.category.delete({ where: { id } });
	},

	countProjectsInCategory(id: string) {
		return prisma.project.count({ where: { categoryId: id } });
	},
};