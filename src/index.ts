import { execSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { blue } from "colorette";
import { detectSync, resolveCommand } from "package-manager-detector";
import type { Plugin } from "vite";

interface PagefindOptions {
	outputDirectory?: string;
	assetsDirectory?: string;
	bundleDirectory?: string;
	buildScript?: string;
	developStrategy?: "lazy" | "eager";
}

type PagefindBuildOptions = Pick<PagefindOptions, "bundleDirectory">;
type PagefindDevelopOptions = PagefindOptions;

function log(message: string) {
	console.log(`${blue("[vite-plugin-pagefind]")} ${message}`);
}

function pagefind(options: PagefindOptions = {}): Plugin[] {
	return [pagefindBuild(options), pagefindDevelop(options)];
}

function pagefindBuild(options: PagefindBuildOptions = {}): Plugin {
	const bundleDirectory = options.bundleDirectory ?? "pagefind";
	return {
		name: "pagefind-build",
		apply: "build",
		config() {
			return {
				build: {
					rollupOptions: {
						external: [
							`/${bundleDirectory}/pagefind.js`,
							`/${bundleDirectory}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
	};
}

function pagefindDevelop(options: PagefindDevelopOptions = {}): Plugin {
	const outputDirectory = options.outputDirectory ?? "build";
	const assetsDirectory = options.assetsDirectory ?? "public";
	const bundleDirectory = options.bundleDirectory ?? "pagefind";
	const buildScript = options.buildScript ?? "build";
	const developStrategy = options.developStrategy ?? "lazy";
	return {
		name: "pagefind-develop",
		apply: "serve",
		config() {
			return {
				assetsInclude: ["**/pagefind.js", "**/pagefind-highlight.js"],
				build: {
					rollupOptions: {
						external: [
							`/${bundleDirectory}/pagefind.js`,
							`/${bundleDirectory}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
		configResolved(config) {
			const absoluteOutputDirectory = resolve(config.root, outputDirectory);
			const absoluteAssetsDirectory = resolve(config.root, assetsDirectory);
			function build() {
				const packageManager = detectSync({ cwd: config.root });
				if (!packageManager) {
					return;
				}
				const resolvedCommand = resolveCommand(packageManager.agent, "run", [
					buildScript,
				]);
				if (!resolvedCommand) {
					return;
				}
				const command = `${resolvedCommand.command} ${resolvedCommand.args.join(" ")}`;
				log(`Building with "${command}"...`);
				execSync(command, {
					cwd: config.root,
				});
				log(`Successfully build with "${command}."`);
			}
			function copyBundle() {
				log(`Copying bundle to "${assetsDirectory}"...`);
				cpSync(
					resolve(absoluteOutputDirectory, bundleDirectory),
					resolve(absoluteAssetsDirectory, bundleDirectory),
					{
						recursive: true,
					},
				);
				log(`Successfully copied bundle to "${assetsDirectory}."`);
			}
			switch (developStrategy) {
				case "lazy": {
					if (existsSync(resolve(absoluteAssetsDirectory, bundleDirectory))) {
						return;
					}
					if (existsSync(resolve(absoluteOutputDirectory, bundleDirectory))) {
						copyBundle();
						return;
					}
					build();
					copyBundle();
					break;
				}
				case "eager": {
					build();
					copyBundle();
					break;
				}
			}
		},
	};
}

export type { PagefindOptions, PagefindBuildOptions, PagefindDevelopOptions };

export { pagefind, pagefindBuild, pagefindDevelop };
