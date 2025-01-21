import { defineBuildConfig } from "unbuild";

const config = defineBuildConfig({
	entries: ["src/index.ts", "src/types.ts"],
	outDir: "dist",
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
		inlineDependencies: true,
	},
});

export default config;
