import { resolve } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { performance } from 'perf_hooks';
import { blue, bold } from 'colorette';
import { detect, getCommand } from '@antfu/ni';
import type { PluginOption } from 'vite';

export type Config = {
	/**
	 * The directory where the static assets are located relative to the project's root as specified in the vite config.
	 * @default 'public'
	 */
	assetsDir: string;
	/**
	 * The directory where the build output is located relative to the project's root as specified in the vite config.
	 * @default 'dist'
	 */
	buildDir: string;
	/**
	 * The npm script to run to build and index the project.
	 * @default 'build'
	 */
	buildScript: string;
};

function console_log(input: string) {
	console.log(`${blue('[vite-plugin-pagefind]')} ${bold(input)}`);
}

async function get_build_command(buildScript: string) {
	return getCommand((await detect()) ?? 'npm', 'run', [buildScript]);
}

async function execute_measured(fn: () => Promise<unknown> | unknown) {
	const start = performance.now();
	await fn();
	const stop = performance.now();
	return stop - start;
}

function millisToSeconds(time: number) {
	return `${(time / 1000).toFixed(2)}s`;
}

function dev(options: Config): PluginOption {
	return {
		name: 'pagefind-dev',
		apply: 'serve',
		async config(config) {
			const buildDir = resolve(config.root, options.buildDir);
			const publicPagefindDir = resolve(
				config.root,
				options.assetsDir,
				'pagefind'
			);
			const buildPagefindDir = resolve(
				config.root,
				options.buildDir,
				'pagefind'
			);
			if (!existsSync(publicPagefindDir)) {
				console_log('Pagefind not found.');
				if (!existsSync(buildPagefindDir)) {
					const buildCommand = await get_build_command(
						options.buildScript
					);
					console_log(`Build not found, running "${buildCommand}".`);
					const time = await execute_measured(() =>
						execSync(buildCommand, { cwd: config.root })
					);
					console_log(`Build completed in ${millisToSeconds(time)}.`);
				}
				console_log('Running pagefind...');
				const time = await execute_measured(() =>
					execSync(
						`pagefind --site "${buildDir}" --output-path "${publicPagefindDir}"`,
						{ cwd: config.root }
					)
				);
				console_log(`Pagefind completed in ${millisToSeconds(time)}.`);
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

function build(): PluginOption {
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

export function pagefind(options: Partial<Config> = {}): PluginOption {
	const {
		assetsDir = 'public',
		buildDir = 'dist',
		buildScript = 'build'
	} = options;
	return [dev({ assetsDir, buildDir, buildScript }), build()];
}
