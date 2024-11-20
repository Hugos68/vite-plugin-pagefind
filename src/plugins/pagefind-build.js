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
			const pagefind_url = pagefind_config.pagefind_url;
			return {
				build: {
					rollupOptions: {
						external: [
							`/${pagefind_url}/pagefind.js`,
							`/${pagefind_url}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
	};
}
