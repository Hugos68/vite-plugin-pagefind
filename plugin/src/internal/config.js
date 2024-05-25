import { resolve } from "node:path";
import { promises } from "node:fs";
import * as v from "valibot";

const PagefindConfigSchema = v.object({
	site: v.string(),
	vite_plugin_pagefind: v.optional(
		v.object({
			assets_dir: v.optional(v.string(), "public"),
			build_command: v.optional(v.string(), "npm run build"),
			dev_strategy: v.optional(v.string(), "lazy"),
		}),
		{},
	),
});

/**
 * Get the Pagefind configuration for the current project.
 * @param {string} cwd
 * @returns {Promise<v.InferOutput<typeof PagefindConfigSchema>>} A promise resolving to the Pagefind configuration.
 */
export async function get_pagefind_config(cwd) {
	const pagefind_raw = await promises.readFile(
		resolve(cwd, "pagefind.json"),
		"utf-8",
	);
	const pagefind_parsed = JSON.parse(pagefind_raw);
	return v.parse(PagefindConfigSchema, pagefind_parsed);
}
