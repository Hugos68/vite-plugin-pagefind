import { promises } from "node:fs";
import { resolve } from "node:path";
import * as v from "valibot";

/** @typedef {v.InferOutput<typeof PagefindConfigSchema>} PagefindPluginConfig */
/** @exports PagefindPluginConfig */

const PagefindConfigSchema = v.object({
	site: v.string(),
	assets_dir: v.optional(v.string(), "public"),
	pagefind_dir: v.optional(v.string(), "pagefind"),
	build_command: v.optional(v.string(), "npm run build"),
	dev_strategy: v.optional(v.picklist(["eager", "lazy"]), "lazy"),
});

/**
 * Get the Pagefind configuration in the pagefind.json file
 * @returns {Promise<{[key: string]: string}>} The parsed pagefind.json object
 */
export async function get_json_config() {
	const cwd = process.cwd();
	let pagefind_raw = "{}";

	try {
		pagefind_raw = await promises.readFile(
			resolve(cwd, "pagefind.json"),
			"utf-8",
		);
	} catch {
		return {};
	}

	const pagefind_json = JSON.parse(pagefind_raw);
	const site = pagefind_json.site;
	const plugin_config = pagefind_json.vite_plugin_pagefind;
	plugin_config.site = site;
	return plugin_config;
}

/**
 * Merge the configuration from the given pagefind config and the pagefind.json file
 * @param {PagefindPluginConfig?} given_pagefind_config
 * @param {{[key: string]: string}} json_config
 */
export function merge_plugin_config(given_pagefind_config, json_config) {
	const merged_config = { ...(given_pagefind_config ?? {}), ...json_config };
	return merged_config;
}

/**
 * Parse the Pagefind configuration in the pagefind.json file
 * @param {{[key: string]: string} | PagefindPluginConfig} raw_pagefind_config
 * @returns {PagefindPluginConfig} The validated pagefind configuration object
 */
export function validate_pagefind_config(raw_pagefind_config) {
	const raw_pagefind_dir = raw_pagefind_config.pagefind_dir ?? "pagefind";
	const fixed_pagefind_dir = raw_pagefind_dir.replace(/^\/+|\/+$/g, "");
	raw_pagefind_config.pagefind_dir = fixed_pagefind_dir;
	return v.parse(PagefindConfigSchema, raw_pagefind_config);
}

/**
 * Get the configuration for the plugin
 * @param {PagefindPluginConfig?} given_config
 * @returns {Promise<PagefindPluginConfig>} The validated pagefind configuration object
 */
export default async function get_plugin_config(given_config) {
	const json_config = await get_json_config();
	const merged_config = merge_plugin_config(given_config, json_config);
	const validated_config = validate_pagefind_config(merged_config);
	return validated_config;
}
