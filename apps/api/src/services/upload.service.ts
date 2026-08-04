import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, bucketName } from "../lib/aws/s3.js";
import { randomUUID } from "node:crypto";

const PRESIGN_EXPIRY_SECONDS = 300;

const ALLOWED_MEDIA_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"video/mp4",
	"model/gltf-binary",
]);

type UploadKind = "media" | "downloads";

interface PresignInput {
	projectId: string;
	fileName: string;
	contentType: string;
	kind: UploadKind;
}

export const uploadService = {
	async createPresignedUploadUrl({ projectId, fileName, contentType, kind }: PresignInput) {
		if (!ALLOWED_MEDIA_TYPES.has(contentType)) {
			throw new Error(`Unsupported content type: ${contentType}`);
		}

		const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
		const storageKey = `projects/${projectId}/${kind}/${randomUUID()}-${safeName}`;

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: storageKey,
			ContentType: contentType,
		});

		const uploadUrl = await getSignedUrl(s3, command, { expiresIn: PRESIGN_EXPIRY_SECONDS });

		return { uploadUrl, storageKey, expiresIn: PRESIGN_EXPIRY_SECONDS };
	},
};