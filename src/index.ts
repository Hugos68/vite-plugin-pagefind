import { execSync } from "node:child_process";
import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { blue } from "colorette";
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

function pagefind(options: PagefindOptions) {
	return [pagefindBuild(options), pagefindDevelop(options)] satisfies Plugin[];
}

function pagefindBuild(options: PagefindBuildOptions) {
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
	} satisfies Plugin;
}

function pagefindDevelop(options: PagefindDevelopOptions) {
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
				log(`Building site using "${buildScript}"...`);
				execSync(buildScript, {
					cwd: config.root,
				});
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
			}

			switch (developStrategy) {
				case "lazy": {
					const bundleInsideAssets = execSync(
						resolve(absoluteAssetsDirectory, bundleDirectory),
					);
					if (bundleInsideAssets) {
						return;
					}
					const bundleInsideOutput = execSync(
						resolve(absoluteOutputDirectory, bundleDirectory),
					);
					if (bundleInsideOutput) {
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
	} satisfies Plugin;
}

export type { PagefindOptions, PagefindBuildOptions, PagefindDevelopOptions };

export { pagefind, pagefindBuild, pagefindDevelop };
