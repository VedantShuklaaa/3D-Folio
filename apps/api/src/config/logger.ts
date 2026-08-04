import pino from "pino";
import { env } from "./env.js";

const isProd = env.NODE_ENV === "production";

export const logger = pino({
	level: isProd ? "info" : "debug",
	...(!isProd && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "SYS:standard",
				ignore: "pid,hostname",
			},
		},
	}),
});