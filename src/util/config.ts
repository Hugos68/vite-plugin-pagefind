import * as v from 'valibot';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const PagefindConfigSchema = v.object({
	site: v.string(),
	vite_plugin: v.object({
		assets_dir: v.string(),
		build_command: v.string(),
		dev_strategy: v.string()
	})
});

export function get_pagefind_config(cwd: string) {
	const pagefind_raw = readFileSync(resolve(cwd, 'pagefind.json'), 'utf-8');
	const pagefind_parsed = JSON.parse(pagefind_raw);
	return v.parse(PagefindConfigSchema, pagefind_parsed);
}
