import type { CorsOptions } from "cors";
import { env } from "./env.js";

const allowedOrigins =
	env.NODE_ENV === "production"
		? ["https://yoursite.com", "https://www.yoursite.com"]
		: ["http://localhost:3000", "http://localhost:5173"];

export const corsOptions: CorsOptions = {
	origin(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};