import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/apiError.js";
import type { Role } from "../generated/prisma/client.js";

export const userService = {
	async searchUsers(params: { search?: string; page: number; limit: number }) {
		const { search, page, limit } = params;
		const skip = (page - 1) * limit;

		const [users, total] = await Promise.all([
			userRepository.findMany({ ...(search && { search }), skip, take: limit }),
			userRepository.count({ ...(search && { search }) }),
		]);

		return {
			users,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	},

	async updateUserRole(id: string, role: Role, requestingUserId: string) {
		if (id === requestingUserId) {
			throw ApiError.badRequest("You cannot change your own role");
		}

		const user = await userRepository.findById(id);
		if (!user) {
			throw ApiError.notFound("User not found");
		}

		return userRepository.updateRole(id, role);
	},

	async updateUserActive(id: string, isActive: boolean, requestingUserId: string) {
		if (id === requestingUserId) {
			throw ApiError.badRequest("You cannot deactivate your own account");
		}

		const user = await userRepository.findById(id);
		if (!user) {
			throw ApiError.notFound("User not found");
		}

		return userRepository.updateActive(id, isActive);
	},
};