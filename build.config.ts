import { defineBuildConfig } from "unbuild";

const config = defineBuildConfig({
	entries: ["src/index.ts", "src/types.ts"],
	outDir: "dist",
	clean: true,
	declaration: true,
});

export default config;
