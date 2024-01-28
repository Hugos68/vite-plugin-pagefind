import type { PluginOption, ResolvedConfig } from 'vite';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { green } from 'colorette';

function log(input: string) {
	console.log(`${green('[vite-plugin-pagefind]')} ${input}`);
}

export type PagefindConfig = {
	appDir: string;
	buildDir: string;
	cwd?: string;
};

type PagefindDevConfig = Required<PagefindConfig>;

type PagefindBuildConfig = Omit<Required<PagefindConfig>, 'appDir'>;

function pagefindDev({
	appDir,
	buildDir,
	cwd
}: PagefindDevConfig): PluginOption {
	return {
		name: 'pagefind-dev',
		apply: 'serve',
		configureServer() {
			if (!existsSync(appDir)) {
				log('Pagefind not found.');
				if (!existsSync(join(buildDir, 'pagefind'))) {
					log('Build not found, building...');
					execSync('vite build', { cwd });
					log('Build complete.');
				}
				log('Running pagefind...');
				execSync(
					`pagefind --site "${buildDir}" --output-path "${appDir}"`,
					{ cwd }
				);
				log('Pagefind complete.');
			}
		}
	};
}

function pagefindBuild({ buildDir, cwd }: PagefindBuildConfig): PluginOption {
	let config: ResolvedConfig | null = null;
	return {
		name: 'pagefind-build',
		apply: 'build',
		configResolved(_config: ResolvedConfig) {
			config = _config;
		},
		closeBundle() {
			if (!config?.build.ssr) {
				return;
			}
			log('Running pagefind...');
			execSync(`pagefind --site "${buildDir}"`, { cwd });
			log('Pagefind complete.');
		}
	};
}

export function pagefind({
	appDir,
	buildDir,
	cwd = process.cwd()
}: PagefindConfig): PluginOption {
	appDir = join(cwd, appDir, 'pagefind');
	buildDir = join(cwd, buildDir);
	return [
		pagefindDev({ appDir, buildDir, cwd }),
		pagefindBuild({ buildDir, cwd })
	];
}
