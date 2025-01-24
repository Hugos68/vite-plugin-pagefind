import { describe, expect, it } from "bun:test";
import { pagefindBuild } from "../src";

describe("pagefindBuild", () => {
	it("has `pagefind-build` as name", () => {
		const plugin = pagefindBuild();
		expect(plugin.name).toBe("pagefind-build");
	});
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
		const plugin = pagefindBuild({ bundleDirectory: "custom" });
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
