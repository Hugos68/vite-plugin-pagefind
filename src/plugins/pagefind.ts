
import type * as v from 'valibot';
import { type ConfigSchema, getInlineConfig, getJsonConfig } from "../internal/config.js";
import pagefindDev from "./pagefind-dev.js";
import pagefindBuild from "./pagefind-build.js";

export default async function pagefind(config?: v.InferInput<typeof ConfigSchema>) {
	const jsonConfig = getJsonConfig();
	const inlineConfig = getInlineConfig(config ?? {});
	return [pagefindDev(jsonConfig ?? inlineConfig), pagefindBuild(jsonConfig ?? inlineConfig)]
}
