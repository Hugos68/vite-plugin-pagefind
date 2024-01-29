import type { PluginOption, ResolvedConfig } from 'vite';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { blue, bold } from 'colorette';
import * as pagefind from 'pagefind';

type PagefindPluginConfig = {
	publicDir: string;
	buildDir: string;
};

type PagefindDevPluginConfig = Required<PagefindPluginConfig>;
type PagefindBuildPluginConfig = Pick<PagefindPluginConfig, 'buildDir'>;

function log(input: string) {
	console.log(`${blue('[vite-plugin-pagefind]')} ${bold(input)}`);
}

function pagefindDevPlugin({
	publicDir,
	buildDir
}: PagefindDevPluginConfig): PluginOption {
	return {
		name: 'pagefind-dev',
		apply: 'serve',
		enforce: 'pre',
		config() {
			return {
				assetsInclude: '**/pagefind.js',
				build: {
					rollupOptions: {
						external: '/pagefind/pagefind.js'
					}
				}
			};
		},
		async configureServer() {
			if (!existsSync(join(publicDir, 'pagefind'))) {
				log('Pagefind not found.');
				if (!existsSync(join(buildDir, 'pagefind'))) {
					log('Build not found, building...');
					execSync('vite build');
					log('Build complete.');
				}
				log('Running pagefind...');
				const { index } = await pagefind.createIndex({});
				await index.addDirectory({
					path: buildDir
				});
				await index.writeFiles({
					outputPath: join(publicDir, 'pagefind')
				});
				await pagefind.close();
				log('Pagefind complete.');
			}
		}
	};
}

function pagefindBuildPlugin({
	buildDir
}: PagefindBuildPluginConfig): PluginOption {
	let config: ResolvedConfig | null = null;
	return {
		name: 'pagefind-build',
		apply: 'build',
		enforce: 'post',
		config() {
			return {
				build: {
					rollupOptions: {
						external: '/pagefind/pagefind.js'
					}
				}
			};
		},
		configResolved(_config: ResolvedConfig) {
			config = _config;
		},
		async closeBundle() {
			if (!config?.build.ssr) {
				return;
			}
			log('Running pagefind...');
			const { index } = await pagefind.createIndex({});
			await index.addDirectory({
				path: buildDir
			});
			await index.writeFiles({
				outputPath: join(buildDir, 'pagefind')
			});
			await pagefind.close();
			log('Pagefind complete.');
		}
	};
}

function pagefindPlugin({
	publicDir,
	buildDir
}: PagefindPluginConfig): PluginOption {
	publicDir = join(process.cwd(), publicDir);
	buildDir = join(process.cwd(), buildDir);
	return [
		pagefindDevPlugin({ publicDir, buildDir }),
		pagefindBuildPlugin({ buildDir })
	];
}

export { pagefindPlugin as pagefind, PagefindPluginConfig as PagefindConfig };
