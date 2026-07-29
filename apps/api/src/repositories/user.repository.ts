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
};