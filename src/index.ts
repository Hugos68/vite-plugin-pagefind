import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { green } from 'colorette';

function log(input: string) {
	console.log(`${green('[vite-plugin-pagefind]')} ${input}`);
}

type PagefindConfig = {
	pagefindDir: string;
	buildDir?: string;
	cwd?: string;
};

export default function ({
	pagefindDir,
	buildDir = 'build',
	cwd = process.cwd()
}: PagefindConfig) {
	pagefindDir = join(cwd, pagefindDir);
	buildDir = join(cwd, 'build');

	function configureServer() {
		if (!existsSync(pagefindDir)) {
			log('Pagefind not found.');
			if (!existsSync(join(buildDir, 'pagefind'))) {
				log('Build not found, building...');
				execSync('vite build');
				log('Build complete.');
			}
			log('Running pagefind...');
			execSync(
				`pagefind --site ${buildDir} --output-path ${pagefindDir}`
			);
			log('Pagefind complete.');
		}
	}

	function closeBundle() {
		log('Running pagefind...');
		execSync(`pagefind --site ${buildDir}`);
		log('Pagefind complete.');
	}

	return {
		name: 'pagefind',
		configureServer,
		closeBundle
	};
}
