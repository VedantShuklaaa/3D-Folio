export function generateSlug(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

export function generateUniqueSlug(input: string, suffix: string | number): string {
	return `${generateSlug(input)}-${suffix}`;
}