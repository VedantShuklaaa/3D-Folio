import { generateCodeVerifier, generateState, OAuth2RequestError } from "arctic";
import { google } from "../lib/google.js";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/apiError.js";

interface GoogleUserInfo {
	sub: string;
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
}

export const authService = {
	createGoogleAuthUrl() {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();

		const url = google.createAuthorizationURL(state, codeVerifier, [
			"openid",
			"email",
			"profile",
		]);

		return { url: url.toString(), state, codeVerifier };
	},

	async handleGoogleCallback(code: string, codeVerifier: string) {
		let tokens;
		try {
			tokens = await google.validateAuthorizationCode(code, codeVerifier);
		} catch (e) {
			if (e instanceof OAuth2RequestError) {
				throw ApiError.badRequest("Invalid or expired authorization code");
			}
			throw ApiError.badGateway("Failed to reach Google's token endpoint");
		}

		let googleUser: GoogleUserInfo;
		try {
			const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
				headers: { Authorization: `Bearer ${tokens.accessToken()}` },
			});

			if (!res.ok) {
				throw ApiError.badGateway(
					`Google userinfo request failed with status ${res.status}`
				);
			}

			googleUser = (await res.json()) as GoogleUserInfo;
		} catch (e) {
			if (e instanceof ApiError) throw e;
			throw ApiError.badGateway("Failed to fetch Google user info");
		}

		if (!googleUser.email || !googleUser.sub) {
			throw ApiError.badGateway("Incomplete profile data returned by Google");
		}

		if (!googleUser.email_verified) {
			throw ApiError.forbidden("Google email is not verified");
		}

		const existingByGoogleId = await userRepository.findByGoogleId(googleUser.sub);
		if (!existingByGoogleId) {
			const existingByEmail = await userRepository.findByEmail(googleUser.email);
			if (existingByEmail) {
				throw ApiError.conflict(
					"An account with this email already exists under a different sign-in method"
				);
			}
		}

		let user = await userRepository.upsertFromGoogle({
			googleId: googleUser.sub,
			email: googleUser.email,
			name: googleUser.name,
			picture: googleUser.picture,
		});

		if (user.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() && user.role !== "ADMIN") {
			user = await userRepository.updateRole(user.id, "ADMIN");
		}

		const totalUsers = await userRepository.count({});
		if (totalUsers === 1 && user.role !== "ADMIN") {
			user = await userRepository.updateRole(user.id, "ADMIN");
		}

		if (!user.isActive) {
			throw ApiError.forbidden("This account has been deactivated");
		}

		return user;
	},
};