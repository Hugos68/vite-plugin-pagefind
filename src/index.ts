import type { PluginOption, ResolvedConfig } from 'vite';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { green } from 'colorette';

function log(input: string) {
	console.log(`${green('[vite-plugin-pagefind]')} ${input}`);
}

export type PagefindConfig = {
	pagefindDir: string;
	siteDir: string;
	cwd?: string;
};

type PagefindDevConfig = Required<PagefindConfig>;

type PagefindBuildConfig = Omit<Required<PagefindConfig>, 'pagefindDir'>;

function pagefindDev({
	pagefindDir,
	siteDir,
	cwd
}: PagefindDevConfig): PluginOption {
	return {
		name: 'pagefind-dev',
		apply: 'serve',
		configureServer() {
			if (!existsSync(pagefindDir)) {
				log('Pagefind not found.');
				if (!existsSync(join(siteDir, 'pagefind'))) {
					log('Build not found, building...');
					execSync('vite build', { cwd });
					log('Build complete.');
				}
				log('Running pagefind...');
				execSync(
					`pagefind --site "${siteDir}" --output-path "${pagefindDir}"`,
					{ cwd }
				);
				log('Pagefind complete.');
			}
		}
	};
}

function pagefindBuild({ siteDir, cwd }: PagefindBuildConfig): PluginOption {
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
			execSync(`pagefind --site "${siteDir}"`, { cwd });
			log('Pagefind complete.');
		}
	};
}

export function pagefind({
	pagefindDir,
	siteDir = 'build',
	cwd = process.cwd()
}: PagefindConfig): PluginOption {
	pagefindDir = join(cwd, pagefindDir);
	siteDir = join(cwd, siteDir);
	return [
		pagefindDev({ pagefindDir, siteDir, cwd }),
		pagefindBuild({ siteDir, cwd })
	];
}
