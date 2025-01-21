import { describe, expect, it } from "vitest";
import { pagefindBuild, pagefindDevelop } from "../src";

describe("pagefindBuild", () => {
	it("only applies to the build phase", () => {
		const plugin = pagefindBuild();
		expect(plugin.apply).toBe("build");
	});
	it("externalizes the pagefind bundle", () => {
		const plugin = pagefindBuild();
		const config = plugin.config();

		expect(config).toMatchObject({
			build: {
				rollupOptions: {
					external: [
						"/pagefind/pagefind.js",
						"/pagefind/pagefind-highlight.js",
					],
				},
			},
		});
	});
	it("externalizes the pagefind bundle with custom bundle directory", () => {
		const plugin = pagefindDevelop({ bundleDirectory: "custom" });
		const config = plugin.config();
		expect(config).toMatchObject({
			build: {
				rollupOptions: {
					external: ["/custom/pagefind.js", "/custom/pagefind-highlight.js"],
				},
			},
		});
	});
});
