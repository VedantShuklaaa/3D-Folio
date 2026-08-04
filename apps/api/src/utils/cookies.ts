export function parseCookies(header: string): Record<string, string> {
	return Object.fromEntries(
		header
			.split("; ")
			.filter(Boolean)
			.map((c) => {
				const [key, ...v] = c.split("=");
				return [key, v.join("=")];
			})
	);
}