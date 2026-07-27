import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	PORT: z.coerce.number().default(5000),

	AWS_ACCESS_KEY_ID: z.string().min(1),
	AWS_SECRET_ACCESS_KEY: z.string().min(1),
	AWS_REGION: z.string().default("ap-south-1"),

	AWS_BUCKET_PROD: z.string().min(1),
	AWS_BUCKET_DEV: z.string().min(1),
	AWS_BUCKET_BACKUPS: z.string().min(1),

	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	GOOGLE_REDIRECT_URI: z.url(),

	JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

	DATABASE_URL: z.url(),

	ADMIN_EMAIL: z.email(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(z.treeifyError(parsed.error));
	process.exit(1);
}

export const env = parsed.data;