import { get_pagefind_config } from "../internal/config.js";
import { PACKAGE_NAME } from "../internal/constants.js";

/**
 * Vite plugin to allow building websites with Pagefind.
 * @returns {import('vite').Plugin}
 */
export default function build() {
	return {
		name: `${PACKAGE_NAME}-build`,
		apply: "build",
		async config() {
			const cwd = process.cwd();
			const pagefind_config = await get_pagefind_config(cwd);
			const pagefind_dir = pagefind_config.vite_plugin_pagefind.pagefind_dir;
			return {
				build: {
					rollupOptions: {
						external: [
							`/${pagefind_dir}/pagefind.js`,
							`/${pagefind_dir}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
	};
}
