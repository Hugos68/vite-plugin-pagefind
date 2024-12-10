import { join } from "node:path";
import {existsSync, readFileSync} from "node:fs";
import * as v from "valibot";

const PluginOptionsSchema = v.object({
	assetsDir: v.optional(v.string(), "public"),
	pagefindDir: v.pipe(v.optional(v.string(), "pagefind"), v.transform((input) => {
		return input.replace(/^\/+|\/+$/g, "");
	})),
	buildCommand: v.optional(v.string(), "npm run build"),
	devStrategy: v.optional(v.picklist(["eager", "lazy"]), "lazy"),
});

export const JsonConfigSchema = v.pipe(v.object({
	site: v.string(),
	vitePluginPagefind: PluginOptionsSchema
}), v.transform((input) => {
	return {
		site: input.site,
		...input.vitePluginPagefind
	}
}));

export const ConfigSchema = v.object({
	site: v.string(),
	...PluginOptionsSchema.entries
});

export function getJsonConfig(cwd = process.cwd()) {
	const path = join(cwd, 'pagefind.json');
	if (!existsSync(path)) {
		return null;
	}
	const config = readFileSync(path, "utf-8");
	return v.parse(JsonConfigSchema, JSON.parse(config));
}

export function getInlineConfig(config: Record<string, unknown>) {
	return v.parse(ConfigSchema, config);
}