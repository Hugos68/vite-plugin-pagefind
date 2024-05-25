import pagefind_build from "./pagefind-build.js";
import pagefind_dev from "./pagefind-dev.js";

/**
 * Vite plugin to allow developing and building websites with Pagefind.
 * @returns {import('vite').PluginOption}
 */
export default function pagefind() {
	return [pagefind_dev(), pagefind_build()];
}