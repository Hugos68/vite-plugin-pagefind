import type { PluginOption } from 'vite';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { performance } from 'perf_hooks';
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

function log(input: string) {
	console.log(`${blue('[vite-plugin-pagefind]')} ${bold(input)}`);
}

async function getBuildCommand(buildScript: string) {
	return getCommand((await detect()) ?? 'npm', 'run', [buildScript]);
}

async function executeMeasured(fn: () => Promise<unknown> | unknown) {
	const start = performance.now();
	await fn();
	const end = performance.now();
	return start - end;
}

function millisToSeconds(time: number) {
	return `${(time / 1000).toFixed(2)}s`;
}

function pagefindDevPlugin({
	publicDir,
	buildDir,
	buildScript
}: PagefindDevPluginConfig): PluginOption {
	return {
		name: 'pagefind-dev',
		apply: 'serve',
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
					const buildCommand = await getBuildCommand(buildScript);
					log(`Build not found, running "${buildCommand}".`);
					const time = await executeMeasured(() =>
						execSync(buildCommand)
					);
					log(`Build completed in ${millisToSeconds(time)}.`);
				}
				log('Running pagefind...');
				const time = await executeMeasured(async () => {
					const { index } = await pagefind.createIndex({});
					await index.addDirectory({
						path: buildDir
					});
					await index.writeFiles({
						outputPath: join(publicDir, 'pagefind')
					});
					await pagefind.close();
				});
				log(`Pagefind completed in ${millisToSeconds(time)}.`);
			}
		}
	};
}

function pagefindBuildPlugin(): PluginOption {
	return {
		name: 'pagefind-build',
		apply: 'build',
		config() {
			return {
				build: {
					rollupOptions: {
						external: '/pagefind/pagefind.js'
					}
				}
			};
		}
	};
}

function pagefindPlugin({
	publicDir = 'public',
	buildDir = 'dist',
	buildScript = 'build'
}: PagefindPluginConfig = {}): PluginOption {
	publicDir = join(process.cwd(), publicDir);
	buildDir = join(process.cwd(), buildDir);
	return [
		pagefindDevPlugin({ publicDir, buildDir, buildScript }),
		pagefindBuildPlugin()
	];
}

export { pagefindPlugin as pagefind, PagefindPluginConfig as PagefindConfig };
