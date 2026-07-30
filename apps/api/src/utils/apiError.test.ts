import { describe, it, expect } from "bun:test";
import { ApiError } from "./apiError.js";

describe("ApiError", () => {
	it("sets the correct status code for badRequest", () => {
		const err = ApiError.badRequest("bad input");
		expect(err.statusCode).toBe(400);
		expect(err.message).toBe("bad input");
	});

	it("is an instance of Error", () => {
		const err = ApiError.notFound();
		expect(err).toBeInstanceOf(Error);
	});
});