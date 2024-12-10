import { PACKAGE_NAME } from "../internal/constants.js";

/**
 * Vite plugin to allow building websites with Pagefind.
 * @param {import("../internal/config.js").PagefindPluginConfig} config
 * @returns {import('vite').Plugin}
 */
export default function build(config) {
	const pagefind_dir = config.pagefind_dir;
	return {
		name: `${PACKAGE_NAME}-build`,
		apply: "build",
		config() {
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
