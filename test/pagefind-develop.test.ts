import { execSync } from "node:child_process";
import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { pagefindDevelop } from "../src";

const mocks = vi.hoisted(() => {
	return {
		fs: {
			existsSync: vi.fn(),
			cpSync: vi.fn(),
		},
		child_process: {
			execSync: vi.fn(),
		},
		"package-manager-detector": {
			detectSync: vi.fn(),
			resolveCommand: vi.fn(),
		},
	};
});

vi.mock("node:fs", () => mocks.fs);
vi.mock("node:child_process", () => mocks.child_process);
vi.mock("package-manager-detector", () => mocks["package-manager-detector"]);

beforeEach(vi.restoreAllMocks);

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
	describe("lazy strategy", () => {
		it("builds and copies the bundle", () => {
			mocks.fs.existsSync.mockReturnValue(false);
			mocks["package-manager-detector"].detectSync.mockReturnValue({
				agent: "npm",
			});
			mocks["package-manager-detector"].resolveCommand.mockReturnValue({
				command: "npm run",
				args: ["build"],
			});
			const plugin = pagefindDevelop({ developStrategy: "lazy" });
			plugin.configResolved({ root: process.cwd() });
			expect(cpSync).toHaveBeenCalledWith(
				resolve(process.cwd(), "build", "pagefind"),
				resolve(process.cwd(), "public", "pagefind"),
				{ recursive: true },
			);
			expect(execSync).toHaveBeenCalled();
		});
		it("skips build and copies the bundle if the bundle is only present in output", () => {
			mocks.fs.existsSync.mockImplementation((path) => {
				if (path === resolve(process.cwd(), "public", "pagefind")) {
					return false;
				}
				if (path === resolve(process.cwd(), "build", "pagefind")) {
					return true;
				}
				return false;
			});
			const plugin = pagefindDevelop({ developStrategy: "lazy" });
			plugin.configResolved({ root: process.cwd() });
			expect(cpSync).toHaveBeenCalledWith(
				resolve(process.cwd(), "build", "pagefind"),
				resolve(process.cwd(), "public", "pagefind"),
				{ recursive: true },
			);
			expect(execSync).not.toHaveBeenCalled();
		});
		it("skips build and copy if bundle already present in assets", () => {
			mocks.fs.existsSync.mockImplementation((path) => {
				if (path === resolve(process.cwd(), "public", "pagefind")) {
					return true;
				}
				if (path === resolve(process.cwd(), "build", "pagefind")) {
					return false;
				}
				return false;
			});
			const plugin = pagefindDevelop({ developStrategy: "lazy" });
			plugin.configResolved({ root: process.cwd() });
			expect(execSync).not.toHaveBeenCalled();
			expect(cpSync).not.toHaveBeenCalled();
		});
	});
	describe("eager strategy", () => {
		it("builds and copies the bundle", () => {
			mocks["package-manager-detector"].detectSync.mockReturnValue({
				agent: "npm",
			});
			mocks["package-manager-detector"].resolveCommand.mockReturnValue({
				command: "npm run",
				args: ["build"],
			});
			const plugin = pagefindDevelop({ developStrategy: "eager" });
			plugin.configResolved({ root: process.cwd() });
			expect(cpSync).toHaveBeenCalledWith(
				resolve(process.cwd(), "build", "pagefind"),
				resolve(process.cwd(), "public", "pagefind"),
				{ recursive: true },
			);
			expect(execSync).toHaveBeenCalled();
		});
	});
});
