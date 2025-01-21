import { describe, expect, it } from "vitest";
import { pagefind } from "../src";

describe("pagefind", () => {
	it("returns `pagefindBuild` and `pagefindDevelop` plugins", () => {
		const plugins = pagefind();
		expect(plugins).toMatchObject([
			expect.objectContaining({ name: "pagefind-build" }),
			expect.objectContaining({ name: "pagefind-develop" }),
		]);
	});
});
