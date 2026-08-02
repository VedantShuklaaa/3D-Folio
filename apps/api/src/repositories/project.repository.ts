import { prisma } from "../lib/prisma.js";
import type { Visibility } from "../generated/prisma/client.js";

interface CreateProjectInput {
	title: string;
	slug: string;
	shortDescription?: string;
	description?: string;
	featured?: boolean;
	published?: boolean;
	visibility?: Visibility;
	categoryId?: string;
	createdBy: string;
	technologyIds?: string[];
}

interface UpdateProjectInput {
	title?: string;
	slug?: string;
	shortDescription?: string;
	description?: string;
	featured?: boolean;
	published?: boolean;
	visibility?: Visibility;
	categoryId?: string;
	technologyIds?: string[];
}

interface FindManyParams {
	skip: number;
	take: number;
	categoryId?: string;
	featured?: boolean;
	published?: boolean;
	search?: string;
	includeUnpublished: boolean;
}

const projectInclude = {
	category: true,
	creator: {
		select: { id: true, name: true, picture: true },
	},
	technologies: true,
	media: { orderBy: { order: "asc" as const } },
	downloads: true,
};

export const projectRepository = {
	findById(id: string) {
		return prisma.project.findUnique({
			where: { id },
			include: projectInclude,
		});
	},

	findBySlug(slug: string) {
		return prisma.project.findUnique({
			where: { slug },
			include: projectInclude,
		});
	},

	findBySlugExcludingId(slug: string, excludeId: string) {
		return prisma.project.findFirst({
			where: { slug, NOT: { id: excludeId } },
		});
	},

	findMany(params: FindManyParams) {
		const { skip, take, categoryId, featured, published, search, includeUnpublished } = params;

		return prisma.project.findMany({
			where: {
				...(categoryId && { categoryId }),
				...(featured !== undefined && { featured }),
				...(includeUnpublished
					? published !== undefined && { published }
					: { published: true, visibility: "PUBLIC" }),
				...(search && {
					OR: [
						{ title: { contains: search, mode: "insensitive" as const } },
						{ shortDescription: { contains: search, mode: "insensitive" as const } },
					],
				}),
			},
			include: projectInclude,
			orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
			skip,
			take,
		});
	},

	count(params: Omit<FindManyParams, "skip" | "take">) {
		const { categoryId, featured, published, search, includeUnpublished } = params;

		return prisma.project.count({
			where: {
				...(categoryId && { categoryId }),
				...(featured !== undefined && { featured }),
				...(includeUnpublished
					? published !== undefined && { published }
					: { published: true, visibility: "PUBLIC" }),
				...(search && {
					OR: [
						{ title: { contains: search, mode: "insensitive" as const } },
						{ shortDescription: { contains: search, mode: "insensitive" as const } },
					],
				}),
			},
		});
	},

	create(data: CreateProjectInput) {
		const { technologyIds, ...rest } = data;

		return prisma.project.create({
			data: {
				...rest,
				...(data.published && { publishedAt: new Date() }),
				...(technologyIds && {
					technologies: { connect: technologyIds.map((id) => ({ id })) },
				}),
			},
			include: projectInclude,
		});
	},

	update(id: string, data: UpdateProjectInput, wasPublished: boolean) {
		const { technologyIds, ...rest } = data;

		return prisma.project.update({
			where: { id },
			data: {
				...rest,
				...(data.published && !wasPublished && { publishedAt: new Date() }),
				...(technologyIds && {
					technologies: { set: technologyIds.map((id) => ({ id })) },
				}),
			},
			include: projectInclude,
		});
	},

	delete(id: string) {
		return prisma.project.delete({ where: { id } });
	},
};