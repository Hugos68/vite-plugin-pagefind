import { exec as exec_callback } from "node:child_process";
import { existsSync, promises } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { PACKAGE_NAME } from "../internal/constants.js";
import type * as v from "valibot";
import type {ConfigSchema} from "../internal/config.js";
import {logger} from "../internal/logger.js";
import type {Plugin} from "vite";

const exec = promisify(exec_callback);

/**
 * Vite plugin to allow developing websites with Pagefind.
 * @param {import("../internal/config.ts").PagefindPluginConfig} config
 * @returns {import('vite').Plugin}
 */
export default function pagefindDev(config: v.InferOutput<typeof ConfigSchema>) {
	return {
		name: `${PACKAGE_NAME}-dev`,
		apply: "serve",
		enforce: "post",
		async config() {
			return {
				assetsInclude: ["**/pagefind.js", "**/pagefind-highlight.js"],
				build: {
					rollupOptions: {
						external: [
							`/${config.pagefindDir}/pagefind.js`,
							`/${config.pagefindDir}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
		async configResolved(viteConfig) {
			const cwd = viteConfig.root ?? process.cwd();
			const siteDir = resolve(cwd, config.site);
			const assetsDir = resolve(cwd, config.assetsDir);
			const buildCommand = config.buildCommand;
			const devStrategy = config.devStrategy;

			async function build() {
				logger.info(`Building site using "${buildCommand}"...`);
				await exec(buildCommand, { cwd });
			}

			async function copyBundle() {
				logger.info(`Copying pagefind bundle to "${config.assetsDir}"...`);
				await promises.cp(
					resolve(siteDir, "pagefind"),
					resolve(assetsDir, "pagefind"),
					{
						recursive: true,
					},
				);
			}

			switch (devStrategy) {
				case "eager": {
					await build();
					await copyBundle();
					break;
				}
				case "lazy": {
					const pagefindInsideAssets = existsSync(
						resolve(assetsDir, "pagefind"),
					);

					if (pagefindInsideAssets) {
						return;
					}

					const pagefindInsideSite = existsSync(resolve(siteDir, "pagefind"));

					if (!pagefindInsideSite) {
						await build();
					}

					await copyBundle();
					break;
				}
				default: {
					throw new Error(`Invalid dev strategy "${devStrategy}".`);
				}
			}
		},
	} satisfies Plugin
}
