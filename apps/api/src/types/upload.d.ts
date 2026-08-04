export enum UploadKind {
	MEDIA = "media",
	DOWNLOAD = "downloads",
}

export interface PresignInput {
	projectId: string;
	fileName: string;
	contentType: string;
	kind: UploadKind;
}