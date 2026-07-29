import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";

const OAUTH_STATE_COOKIE = "google_oauth_state";
const OAUTH_VERIFIER_COOKIE = "google_code_verifier";
const OAUTH_COOKIE_OPTS = {
	httpOnly: true,
	maxAge: 10 * 60 * 1000,
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

	res.clearCookie(OAUTH_STATE_COOKIE);
	res.clearCookie(OAUTH_VERIFIER_COOKIE);

	res.redirect("/");
});