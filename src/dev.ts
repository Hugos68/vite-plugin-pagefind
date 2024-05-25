import { PluginOption } from 'vite';
import { resolve } from 'path';
import { existsSync, promises } from 'fs';
import { exec as exec_callback } from 'child_process';
import { get_pagefind_config } from './util/config.js';
import { console_log } from './util/log.js';
import { PACKAGE_NAME } from './util/constants.js';
import { promisify } from 'util';

const exec = promisify(exec_callback);

export default function dev(): PluginOption {
	return {
		name: `${PACKAGE_NAME}-build`,
		apply: 'serve',
		async config(vite_config) {
			const pagefind_config = get_pagefind_config(vite_config.root);

			async function build() {
				console_log('Building site...');
				await exec(pagefind_config.build_command, {
					cwd: vite_config.root
				});
			}

			async function copy_bundle() {
				console_log(`Copying pagefind bundle to assets dir...`);
				await promises.cp(
					resolve(pagefind_config.site_dir, 'pagefind'),
					resolve(pagefind_config.assets_dir, 'pagefind'),
					{ recursive: true }
				);
			}

			switch (pagefind_config.dev_strategy) {
				case 'eager': {
					await build();
					await copy_bundle();
					break;
				}
				case 'lazy': {
					const pagefind_in_assets = existsSync(
						resolve(pagefind_config.assets_dir, 'pagefind')
					);

					if (pagefind_in_assets) {
						return;
					}

					const pagefind_in_site = existsSync(
						resolve(pagefind_config.site_dir, 'pagefind')
					);

					if (!pagefind_in_site) {
						await build();
					}

					await copy_bundle();
					break;
				}
				default: {
					throw new Error(
						`Invalid dev strategy "${pagefind_config.dev_strategy}".`
					);
				}
			}

			return {
				assetsInclude: '**/pagefind.js',
				build: {
					rollupOptions: {
						external: '/pagefind/pagefind.js'
					}
				}
			};
		}
	};
}
