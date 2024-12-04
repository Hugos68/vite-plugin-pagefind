import get_plugin_config from "../internal/config.js";
import pagefind_build from "./pagefind-build.js";
import pagefind_dev from "./pagefind-dev.js";

/** @typedef {import("../internal/config.js").PagefindPluginConfig} PagefindPluginConfig */
/** @exports PagefindPluginConfig */

/**
 * Vite plugin to allow developing and building websites with Pagefind.
 * @param {PagefindPluginConfig} given_config
 * @returns {Promise<Array<import('vite').Plugin>>}
 */
export default async function pagefind(given_config) {
	const config = await get_plugin_config(given_config);
	return [pagefind_dev(config), pagefind_build(config)];
}
