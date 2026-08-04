import type { Role } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

interface UpsertFromGoogleInput {
	googleId: string;
	email: string;
	name: string;
	picture?: string;
}

export const userRepository = {
	findByGoogleId(googleId: string) {
		return prisma.user.findUnique({ where: { googleId } });
	},

	findByEmail(email: string) {
		return prisma.user.findUnique({ where: { email } });
	},

	findById(id: string) {
		return prisma.user.findUnique({ where: { id } });
	},

	upsertFromGoogle(data: UpsertFromGoogleInput) {
		return prisma.user.upsert({
			where: { googleId: data.googleId },
			update: {
				name: data.name,
				picture: data.picture ?? null,
				lastLoginAt: new Date(),
			},
			create: {
				googleId: data.googleId,
				email: data.email,
				name: data.name,
				picture: data.picture ?? null,
				lastLoginAt: new Date(),
			},
		});
	},

	findMany(params: { search?: string; skip: number; take: number }) {
		const { search, skip, take } = params;

		return prisma.user.findMany({
			...(search && {
				where: {
					OR: [
						{ name: { contains: search, mode: "insensitive" as const } },
						{ email: { contains: search, mode: "insensitive" as const } },
					],
				},
			}),
			orderBy: { createdAt: "desc" },
			skip,
			take,
		});
	},

	count(params: { search?: string }) {
		const { search } = params;

		return prisma.user.count({
			...(search && {
				where: {
					OR: [
						{ name: { contains: search, mode: "insensitive" as const } },
						{ email: { contains: search, mode: "insensitive" as const } },
					],
				},
			}),
		});
	},

	updateRole(id: string, role: Role) {
		return prisma.user.update({ where: { id }, data: { role } });
	},

	updateActive(id: string, isActive: boolean) {
		return prisma.user.update({ where: { id }, data: { isActive } });
	},
};