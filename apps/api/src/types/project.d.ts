import type { Project, Category, Technology, ProjectMedia, ProjectDownload, User } from "../generated/prisma/client.js";

type ProjectWithRelations = Project & {
	category: Category | null;
	creator: Pick<User, "id" | "name" | "picture">;
	technologies: Technology[];
	media: ProjectMedia[];
	downloads: ProjectDownload[];
};

export interface ProjectListDTO {
	id: string;
	title: string;
	slug: string;
	shortDescription: string | null;
	thumbnail: string | null;
	featured: boolean;
	published: boolean;
	category: { id: string; name: string; slug: string } | null;
}

export interface ProjectDetailDTO extends ProjectListDTO {
	description: string | null;
	visibility: string;
	publishedAt: string | null;
	creator: { id: string; name: string; picture: string | null };
	technologies: { id: string; name: string; icon: string | null }[];
	media: { id: string; type: string; storageKey: string; title: string | null; order: number }[];
	downloads: { id: string; type: string; label: string; fileSizeBytes: number | null }[];
	createdAt: string;
	updatedAt: string;
}

export function toProjectListDTO(project: ProjectWithRelations): ProjectListDTO {
	return {
		id: project.id,
		title: project.title,
		slug: project.slug,
		shortDescription: project.shortDescription,
		thumbnail: project.thumbnailKey,
		featured: project.featured,
		published: project.published,
		category: project.category
			? { id: project.category.id, name: project.category.name, slug: project.category.slug }
			: null,
	};
}

export function toProjectDetailDTO(project: ProjectWithRelations): ProjectDetailDTO {
	return {
		...toProjectListDTO(project),
		description: project.description,
		visibility: project.visibility,
		publishedAt: project.publishedAt?.toISOString() ?? null,
		creator: {
			id: project.creator.id,
			name: project.creator.name,
			picture: project.creator.picture,
		},
		technologies: project.technologies.map((t) => ({
			id: t.id,
			name: t.name,
			icon: t.icon,
		})),
		media: project.media.map((m) => ({
			id: m.id,
			type: m.type,
			storageKey: m.storageKey,
			title: m.title,
			order: m.order,
		})),
		downloads: project.downloads.map((d) => ({
			id: d.id,
			type: d.type,
			label: d.label,
			fileSizeBytes: d.fileSizeBytes,
		})),
		createdAt: project.createdAt.toISOString(),
		updatedAt: project.updatedAt.toISOString(),
	};
}