import type { PluginOption, ResolvedConfig } from 'vite';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { blue, bold } from 'colorette';
import { detect, getCommand } from '@antfu/ni';
import * as pagefind from 'pagefind';

type PagefindPluginConfig = {
	publicDir?: string;
	buildDir?: string;
	buildScript?: string;
};

type PagefindDevPluginConfig = {
	publicDir: string;
	buildDir: string;
	buildScript: string;
};

type PagefindBuildPluginConfig = {
	buildDir: string;
};

function log(input: string) {
	console.log(`${blue('[vite-plugin-pagefind]')} ${bold(input)}`);
}

async function getBuildCommand(buildScript: string) {
	return getCommand((await detect()) ?? 'npm', 'run', [buildScript]);
}

function pagefindDevPlugin({
	publicDir,
	buildDir,
	buildScript
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
					execSync(await getBuildCommand(buildScript));
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
	publicDir = 'public',
	buildDir = 'dist',
	buildScript = 'build'
}: PagefindPluginConfig): PluginOption {
	publicDir = join(process.cwd(), publicDir);
	buildDir = join(process.cwd(), buildDir);
	return [
		pagefindDevPlugin({ publicDir, buildDir, buildScript }),
		pagefindBuildPlugin({ buildDir })
	];
}

export { pagefindPlugin as pagefind, PagefindPluginConfig as PagefindConfig };
