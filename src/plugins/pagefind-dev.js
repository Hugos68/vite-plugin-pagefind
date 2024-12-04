import { exec as exec_callback } from "node:child_process";
import { existsSync, promises } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { PACKAGE_NAME } from "../internal/constants.js";
import { log_info } from "../internal/log.js";

const exec = promisify(exec_callback);

/**
 * Vite plugin to allow developing websites with Pagefind.
 * @param {import("../internal/config.js").PagefindPluginConfig} config
 * @returns {import('vite').Plugin}
 */
export default function dev(config) {
	const pagefind_dir = config.pagefind_dir;
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
							`/${pagefind_dir}/pagefind.js`,
							`/${pagefind_dir}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
		async configResolved(vite_config) {
			const cwd = vite_config.root ?? process.cwd();
			const site_dir = resolve(cwd, config.site);
			const assets_dir = resolve(cwd, config.assets_dir);
			const build_command = config.build_command;
			const dev_strategy = config.dev_strategy;

			async function build() {
				log_info(`Building site using "${build_command}"...`);
				await exec(build_command, { cwd });
			}

			async function copy_bundle() {
				log_info(`Copying pagefind bundle to "${config.assets_dir}"...`);
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
