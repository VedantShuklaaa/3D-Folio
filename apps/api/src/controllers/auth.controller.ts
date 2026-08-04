// src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";
import { createSessionToken } from "../config/session.js";

const OAUTH_STATE_COOKIE = "google_oauth_state";
const OAUTH_VERIFIER_COOKIE = "google_code_verifier";
const OAUTH_COOKIE_OPTS = {
	httpOnly: true,
	maxAge: 10 * 60 * 1000,
	sameSite: "lax" as const,
	secure: env.NODE_ENV === "production",
};

const SESSION_COOKIE = "session";
const SESSION_COOKIE_OPTS = {
	httpOnly: true,
	maxAge: 7 * 24 * 60 * 60 * 1000,
	sameSite: "lax" as const,
	secure: env.NODE_ENV === "production",
};

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
	const { url, state, codeVerifier } = authService.createGoogleAuthUrl();

	res.cookie(OAUTH_STATE_COOKIE, state, OAUTH_COOKIE_OPTS);
	res.cookie(OAUTH_VERIFIER_COOKIE, codeVerifier, OAUTH_COOKIE_OPTS);

	res.redirect(url);
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
	const code = req.query.code as string | undefined;
	const state = req.query.state as string | undefined;
	const oauthError = req.query.error as string | undefined;

	if (oauthError) {
		throw ApiError.badRequest(`Google OAuth error: ${oauthError}`);
	}

	const storedState = req.cookies?.[OAUTH_STATE_COOKIE];
	const codeVerifier = req.cookies?.[OAUTH_VERIFIER_COOKIE];

	if (!code) throw ApiError.badRequest("Missing authorization code");
	if (!state || !storedState) throw ApiError.badRequest("Missing OAuth state");
	if (state !== storedState) throw ApiError.forbidden("OAuth state mismatch");
	if (!codeVerifier) throw ApiError.badRequest("Missing PKCE code verifier");

	const user = await authService.handleGoogleCallback(code, codeVerifier);

	const token = createSessionToken(user.id);
	res.cookie(SESSION_COOKIE, token, SESSION_COOKIE_OPTS);

	res.clearCookie(OAUTH_STATE_COOKIE);
	res.clearCookie(OAUTH_VERIFIER_COOKIE);

	res.redirect(env.FRONTEND_URL);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
	res.clearCookie(SESSION_COOKIE);
	res.status(200).json({ success: true, message: "Logged out" });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) {
		throw ApiError.unauthorized("Not authenticated");
	}

	res.status(200).json({
		success: true,
		data: {
			id: req.user.id,
			email: req.user.email,
			name: req.user.name,
			picture: req.user.picture,
			role: req.user.role,
		},
	});
});