import { exec as exec_callback } from "node:child_process";
import { existsSync, promises } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { get_pagefind_config } from "../internal/config.js";
import { PACKAGE_NAME } from "../internal/constants.js";
import { log_info } from "../internal/log.js";

const exec = promisify(exec_callback);

/**
 * Vite plugin to allow developing websites with Pagefind.
 * @returns {import('vite').Plugin}
 */
export default function dev() {
	return {
		name: `${PACKAGE_NAME}-dev`,
		apply: "serve",
		enforce: "post",
		async config() {
			const cwd = process.cwd();
			const pagefind_config = await get_pagefind_config(cwd);
			const pagefind_url = pagefind_config.vite_plugin_pagefind.pagefind_url;
			return {
				assetsInclude: ["**/pagefind.js", "**/pagefind-highlight.js"],
				build: {
					rollupOptions: {
						external: [
							`/${pagefind_url}/pagefind.js`,
							`/${pagefind_url}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
		async configResolved(vite_config) {
			const cwd = vite_config.root ?? process.cwd();
			const pagefind_config = await get_pagefind_config(cwd);

			const site_dir = resolve(cwd, pagefind_config.site);
			const assets_dir = resolve(
				cwd,
				pagefind_config.vite_plugin_pagefind.assets_dir,
			);
			const build_command = pagefind_config.vite_plugin_pagefind.build_command;
			const dev_strategy = pagefind_config.vite_plugin_pagefind.dev_strategy;

			async function build() {
				log_info(`Building site using "${build_command}"...`);
				await exec(build_command, { cwd });
			}

			async function copy_bundle() {
				log_info(
					`Copying pagefind bundle to "${pagefind_config.vite_plugin_pagefind.assets_dir}"...`,
				);
				await promises.cp(
					resolve(site_dir, "pagefind"),
					resolve(assets_dir, "pagefind"),
					{
						recursive: true,
					},
				);
			}

			switch (dev_strategy) {
				case "eager": {
					await build();
					await copy_bundle();
					break;
				}
				case "lazy": {
					const pagefind_in_assets = existsSync(
						resolve(assets_dir, "pagefind"),
					);

					if (pagefind_in_assets) {
						return;
					}

					const pagefind_in_site = existsSync(resolve(site_dir, "pagefind"));

					if (!pagefind_in_site) {
						await build();
					}

					await copy_bundle();
					break;
				}
				default: {
					throw new Error(`Invalid dev strategy "${dev_strategy}".`);
				}
			}
		},
	};
}
