import jwt from "jsonwebtoken";
import { env } from "./env.js";

const JWT_EXPIRES_IN = "7d";

export interface SessionPayload {
	userId: string;
}

export function createSessionToken(userId: string): string {
	return jwt.sign({ userId } satisfies SessionPayload, env.JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
}

export function verifySessionToken(token: string): SessionPayload | null {
	try {
		const decoded = jwt.verify(token, env.JWT_SECRET);
		if (typeof decoded === "string" || !("userId" in decoded)) {
			return null;
		}
		return { userId: decoded.userId as string };
	} catch {
		return null;
	}
}