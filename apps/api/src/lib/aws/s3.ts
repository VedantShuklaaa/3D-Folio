import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../config/env.js"

const globalForS3 = globalThis as unknown as {
	s3: S3Client | undefined;
};

export const s3 =
	globalForS3.s3 ??
	new S3Client({
		region: env.AWS_REGION,
		credentials: {
			accessKeyId: env.AWS_ACCESS_KEY_ID,
			secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
		},
	});

if (process.env.NODE_ENV !== "production") {
	globalForS3.s3 = s3;
}

export const bucketName =
	env.NODE_ENV === "production" ? env.AWS_BUCKET_PROD : env.AWS_BUCKET_DEV;