import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";
import { s3, bucketName } from "../lib/aws/s3.js";
import { env } from "../config/env.js";
import { randomUUID } from "node:crypto";

const PRESIGN_EXPIRY_SECONDS = 300;

interface GenerateUploadUrlInput {
	key: string;
	contentType: string;
}

export const storageService = {
	async generateUploadUrl({ key, contentType }: GenerateUploadUrlInput) {
		const command = new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: contentType });
		const uploadUrl = await getS3SignedUrl(s3, command, { expiresIn: PRESIGN_EXPIRY_SECONDS });
		return { uploadUrl, storageKey: key, expiresIn: PRESIGN_EXPIRY_SECONDS };
	},

	generatePublicUrl(key: string): string {
		return `https://${env.CLOUDFRONT_DOMAIN}/${key}`;
	},

	generateSignedDownloadUrl(key: string, expiresInSeconds = 300): string {
		const url = this.generatePublicUrl(key);
		const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

		return getCloudFrontSignedUrl({
			url,
			keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
			privateKey: env.CLOUDFRONT_PRIVATE_KEY,
			dateLessThan: new Date(expiresAt * 1000).toISOString(),
		});
	},

	async delete(key: string) {
		await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
	},

	buildKey(projectId: string, kind: "media" | "downloads", fileName: string): string {
		const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
		return `projects/${projectId}/${kind}/${randomUUID()}-${safeName}`;
	},
};