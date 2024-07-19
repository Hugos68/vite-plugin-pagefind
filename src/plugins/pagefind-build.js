import { PACKAGE_NAME } from "../internal/constants.js";

/**
 * Vite plugin to allow building websites with Pagefind.
 * @returns {import('vite').Plugin}
 */
export default function build() {
	return {
		name: `${PACKAGE_NAME}-build`,
		apply: "build",
		config() {
			return {
				build: {
					rollupOptions: {
						external: "/pagefind/pagefind.js",
					},
				},
			};
		},
	};
}
