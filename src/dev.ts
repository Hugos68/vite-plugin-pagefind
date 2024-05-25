import { PluginOption } from 'vite';
import { resolve } from 'path';
import { existsSync, promises } from 'fs';
import { execSync } from 'child_process';
import { get_pagefind_config } from './util/config.js';
import { console_log } from './util/log.js';
import { PACKAGE_NAME } from './util/constants.js';

export default function dev(): PluginOption {
	return {
		name: `${PACKAGE_NAME}-build`,
		apply: 'serve',
		async config(vite_config) {
			const pagefind_config = get_pagefind_config(vite_config.root);

			switch (pagefind_config.dev_strategy) {
				case 'eager': {
					console_log('Building pagefind...');
					execSync(pagefind_config.build_command, {
						cwd: vite_config.root
					});
					console_log(`Copying pagefind bundle to assets dir...`);
					await promises.cp(
						resolve(pagefind_config.site_dir, 'pagefind'),
						resolve(pagefind_config.assets_dir, 'pagefind'),
						{ recursive: true }
					);
					break;
				}
				case 'lazy': {
					const pagefind_in_assets = existsSync(
						resolve(pagefind_config.assets_dir, 'pagefind')
					);

					if (!pagefind_in_assets) {
						const pagefind_in_site = existsSync(
							resolve(pagefind_config.site_dir, 'pagefind')
						);

						if (!pagefind_in_site) {
							console_log('Building pagefind...');
							execSync(pagefind_config.build_command, {
								cwd: vite_config.root
							});
						}

						console_log(`Copying pagefind bundle to assets dir...`);
						await promises.cp(
							resolve(pagefind_config.site_dir, 'pagefind'),
							resolve(pagefind_config.assets_dir, 'pagefind'),
							{ recursive: true }
						);
					}
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
