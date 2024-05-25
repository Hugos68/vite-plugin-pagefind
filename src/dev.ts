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
			const resolved_site_dir = resolve(
				vite_config.root,
				pagefind_config.site
			);
			const resolved_assets_dir = resolve(
				vite_config.root,
				pagefind_config.vite_plugin.assets_dir
			);
			const build_command = pagefind_config.vite_plugin.build_command;
			const dev_strategy = pagefind_config.vite_plugin.dev_strategy;

			switch (dev_strategy) {
				case 'eager': {
					console_log('Building pagefind...');
					execSync(build_command, { cwd: vite_config.root });
					console_log(
						`Copying pagefind bundle to ${pagefind_config.vite_plugin.assets_dir}...`
					);
					await promises.cp(
						resolve(resolved_site_dir, 'pagefind'),
						resolve(resolved_assets_dir, 'pagefind'),
						{ recursive: true }
					);
					break;
				}
				case 'lazy': {
					const pagefind_in_assets = existsSync(
						resolve(resolved_assets_dir, 'pagefind')
					);

					if (!pagefind_in_assets) {
						const pagefind_in_site = existsSync(
							resolve(resolved_site_dir, 'pagefind')
						);

						if (!pagefind_in_site) {
							console_log('Building pagefind...');
							execSync(build_command, { cwd: vite_config.root });
						}

						console_log(
							`Copying pagefind bundle to ${pagefind_config.vite_plugin.assets_dir}...`
						);
						await promises.cp(
							resolve(resolved_site_dir, 'pagefind'),
							resolve(resolved_assets_dir, 'pagefind'),
							{ recursive: true }
						);
					}
					break;
				}
				default: {
					throw new Error(`Invalid dev strategy "${dev_strategy}".`);
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
