import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { env } from "../../config/env.js";

export function getPublicUrl(storageKey: string): string {
	return `https://${env.CLOUDFRONT_DOMAIN}/${storageKey}`;
}

export function getSignedDownloadUrl(storageKey: string, expiresInSeconds = 300): string {
	const url = `https://${env.CLOUDFRONT_DOMAIN}/${storageKey}`;
	const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

	return getSignedUrl({
		url,
		keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
		privateKey: env.CLOUDFRONT_PRIVATE_KEY,
		dateLessThan: new Date(expiresAt * 1000).toISOString(),
	});
}