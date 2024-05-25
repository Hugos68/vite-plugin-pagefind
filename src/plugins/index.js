import dev from "./dev.js";
import build from "./build.js";

/**
 * Vite plugin to allow developing and building websites with Pagefind.
 * @returns {import('vite').PluginOption}
 */
export default function pagefind() {
	return [dev(), build()];
}
