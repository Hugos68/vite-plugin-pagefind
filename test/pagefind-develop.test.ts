import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import * as child_process from "node:child_process";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { pagefindDevelop } from "../src";

mock.module("node:fs", () => ({
	existsSync: mock(() => false),
	cpSync: mock(() => {}),
}));

mock.module("node:child_process", () => ({
	execSync: mock(() => {}),
}));

mock.module("package-manager-detector", () => ({
	detectSync: mock(() => ({ agent: "npm" })),
	resolveCommand: mock(() => ({ command: "npm run", args: ["build"] })),
}));

const cpSyncSpy = spyOn(fs, "cpSync");
const execSyncSpy = spyOn(child_process, "execSync");

afterEach(() => {
	mock.restore();
	cpSyncSpy.mockClear();
	execSyncSpy.mockClear();
});

describe("pagefindDevelop", () => {
	it("has `pagefind-develop` as name", () => {
		const plugin = pagefindDevelop();
		expect(plugin.name).toBe("pagefind-develop");
	});
	it("only applies to the serve phase", () => {
		const plugin = pagefindDevelop();
		expect(plugin.apply).toBe("serve");
	});
	it("externalizes the pagefind bundle", () => {
		const plugin = pagefindDevelop();
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
	describe('"lazy" strategy', () => {
		it("builds and copies the bundle when output and bundle are not present", () => {
			mock.module("node:fs", () => ({
				existsSync: mock(() => false),
			}));
			const plugin = pagefindDevelop({ developStrategy: "lazy" });
			// @ts-expect-error - The plugin only requires this bit of the Vite plugin
			plugin.configResolved({
				root: process.cwd(),
			});
			expect(cpSyncSpy).toHaveBeenCalledTimes(1);
			expect(cpSyncSpy.mock.calls).toEqual([
				[
					resolve(process.cwd(), "build", "pagefind"),
					resolve(process.cwd(), "public", "pagefind"),
					{ recursive: true },
				],
			]);
			expect(execSyncSpy).toHaveBeenCalledTimes(1);
			expect(execSyncSpy.mock.calls).toEqual([
				["npm run build", { cwd: process.cwd() }],
			]);
		});
		it("does not build and copies the bundle when output is present and bundle is not", () => {
			mock.module("node:fs", () => ({
				existsSync: mock((path) => {
					if (path === resolve(process.cwd(), "public", "pagefind")) {
						return false;
					}
					if (path === resolve(process.cwd(), "build", "pagefind")) {
						return true;
					}
					return false;
				}),
			}));

			const plugin = pagefindDevelop({ developStrategy: "lazy" });
			// @ts-expect-error - The plugin only requires this bit of the Vite plugin
			plugin.configResolved({
				root: process.cwd(),
			});
			expect(cpSyncSpy).toHaveBeenCalledTimes(1);
			expect(cpSyncSpy.mock.calls).toEqual([
				[
					resolve(process.cwd(), "build", "pagefind"),
					resolve(process.cwd(), "public", "pagefind"),
					{ recursive: true },
				],
			]);
			expect(execSyncSpy).toHaveBeenCalledTimes(0);
		});
		it("does not build nor copies the bundle when output and bundle are present", () => {
			mock.module("node:fs", () => ({
				existsSync: mock(() => true),
			}));
			const plugin = pagefindDevelop({ developStrategy: "lazy" });
			// @ts-expect-error - The plugin only requires this bit of the Vite plugin
			plugin.configResolved({
				root: process.cwd(),
			});
			expect(cpSyncSpy).toHaveBeenCalledTimes(0);
			expect(execSyncSpy).toHaveBeenCalledTimes(0);
		});
	});

	describe('"eager" strategy', () => {
		it("builds and copies the bundle when output and bundle are not present", () => {
			const plugin = pagefindDevelop({ developStrategy: "eager" });
			// @ts-expect-error - The plugin only requires this bit of the Vite plugin
			plugin.configResolved({
				root: process.cwd(),
			});
			expect(cpSyncSpy).toHaveBeenCalledTimes(1);
			expect(cpSyncSpy.mock.calls).toEqual([
				[
					resolve(process.cwd(), "build", "pagefind"),
					resolve(process.cwd(), "public", "pagefind"),
					{ recursive: true },
				],
			]);
			expect(execSyncSpy).toHaveBeenCalledTimes(1);
			expect(execSyncSpy.mock.calls).toEqual([
				["npm run build", { cwd: process.cwd() }],
			]);
		});
		it("builds and copies bundle when output and bundle are present", () => {
			mock.module("node:fs", () => ({
				existsSync: mock(() => true),
			}));
			const plugin = pagefindDevelop({ developStrategy: "eager" });
			// @ts-expect-error - The plugin only requires this bit of the Vite plugin
			plugin.configResolved({
				root: process.cwd(),
			});
			expect(cpSyncSpy).toHaveBeenCalledTimes(1);
			expect(cpSyncSpy.mock.calls).toEqual([
				[
					resolve(process.cwd(), "build", "pagefind"),
					resolve(process.cwd(), "public", "pagefind"),
					{ recursive: true },
				],
			]);
			expect(execSyncSpy).toHaveBeenCalledTimes(1);
			expect(execSyncSpy.mock.calls).toEqual([
				["npm run build", { cwd: process.cwd() }],
			]);
		});
	});
});
