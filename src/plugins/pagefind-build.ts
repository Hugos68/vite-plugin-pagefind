import { PACKAGE_NAME } from "../internal/constants.js";
import type * as v from 'valibot';
import type { ConfigSchema } from "../internal/config.js";


export default function pagefindBuild(config: v.InferOutput<typeof ConfigSchema>) {
	return {
		name: `${PACKAGE_NAME}-build`,
		apply: "build",
		config() {
			return {
				build: {
					rollupOptions: {
						external: [
							`/${config.pagefindDir}/pagefind.js`,
							`/${config.pagefindDir}/pagefind-highlight.js`,
						],
					},
				},
			};
		},
	};
}
