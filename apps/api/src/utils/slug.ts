export function generateSlug(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "") // strip accents
		.replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric chars
		.replace(/\s+/g, "-") // spaces -> hyphens
		.replace(/-+/g, "-") // collapse multiple hyphens
		.replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

export function generateUniqueSlug(input: string, suffix: string | number): string {
	return `${generateSlug(input)}-${suffix}`;
}