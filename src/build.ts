import { PluginOption } from 'vite';
import { PACKAGE_NAME } from './util/constants.js';

export default function build(): PluginOption {
	return {
		name: `${PACKAGE_NAME}-build`,
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
