import type { PluginOption, ResolvedConfig } from 'vite';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { cyan } from 'colorette';
import * as pagefind from 'pagefind';

export type PagefindConfig = {
	appDir: string;
	buildDir: string;
	cwd?: string;
};

type PagefindDevConfig = Required<PagefindConfig>;

type PagefindBuildConfig = Pick<PagefindConfig, 'buildDir'>;

function log(input: string) {
	console.log(`${cyan('[vite-plugin-pagefind]')} ${input}`);
}

function pagefindDev({
	appDir,
	buildDir,
	cwd
}: PagefindDevConfig): PluginOption {
	return {
		name: 'pagefind-dev',
		apply: 'serve',
		enforce: 'pre',
		config() {
			return {
				assetsInclude: '**/pagefind.js'
			};
		},
		async configureServer() {
			if (!existsSync(appDir)) {
				log('Pagefind not found.');
				if (!existsSync(join(buildDir, 'pagefind'))) {
					log('Build not found, building...');
					execSync('vite build', { cwd });
					log('Build complete.');
				}
				log('Running pagefind...');
				const { index } = await pagefind.createIndex({});
				await index.addDirectory({
					path: buildDir
				});
				await index.writeFiles({
					outputPath: join(appDir, 'pagefind')
				});
				log('Pagefind complete.');
			}
		}
	};
}

function pagefindBuild({ buildDir }: PagefindBuildConfig): PluginOption {
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
			console.log('called!');
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
			log('Pagefind complete.');
		}
	};
}

function pluginPagefind({
	appDir,
	buildDir,
	cwd = process.cwd()
}: PagefindConfig): PluginOption {
	appDir = join(cwd, appDir, 'pagefind');
	buildDir = join(cwd, buildDir);
	return [
		pagefindDev({ appDir, buildDir, cwd }),
		pagefindBuild({ buildDir })
	];
}

export { pluginPagefind as pagefind };
