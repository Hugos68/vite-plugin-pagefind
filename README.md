# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into Vite based projects.

## Features

- Ensures pagefind is present during development.
- Ensures pagefind can be safely used through dynamic imports in conjunction with Vite.

## Why?

Read about the reasoning for this plugin here: [https://hugokorte.pages.dev/articles/pagefind-with-vite](https://portfolio-2-70z.pages.dev/blog/pagefind-with-vite/)

## Installation

Install from npm using your preferred package manager:

```bash
pnpm add -D pagefind vite-plugin-pagefind
```

## Usage

1. Add the plugin to in `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import pagefind from "vite-plugin-pagefind";

export default defineConfig({
	plugins: [pagefind()],
});
```

You can pass the options to the plugin directly in your Vite configuration:

```ts
import { defineConfig } from "vite";
import pagefind from "vite-plugin-pagefind";

export default defineConfig({
	plugins: [
		pagefind({
			site: "<BUILD_DIR>",
			assets_dir: "<ASSETS_DIR>",
			pagefind_dir: "<PAGEFIND_DIR>",
			build_command: "<BUILD_COMMAND>",
			dev_strategy: "<DEV_STRATEGY>",
		}),
	],
});
```

Note: If you decide to use an inline config, you would still need to add the `--site` flag to your `pagefind` command.

Note: If your framework does not have a `vite.config` consider consulting the framework documentation to see how to add a Vite plugin.

2. Add the post build command to your `package.json`:

```json
{
	"scripts": {
		"build": "vite build && pagefind"
	}
}
```

3. If you didn't pass the configuration options to the plugin, you can use the `pagefind.json` file to configure the plugin, as shown:

```json
{
	"site": "<BUILD_DIR>",
	"vite_plugin_pagefind": {
		"assets_dir": "<ASSETS_DIR>",
		"pagefind_dir": "<PAGEFIND_DIR>",
		"build_command": "<BUILD_COMMAND>",
		"dev_strategy": "<DEV_STRATEGY>"
	}
}
```

If for some reason you decide to define your configuration in both the file and the Vite configuration, the file will take precedence over the inline Vite configuration.

Note: `vite-plugin-pagefind` currently only supports `.json` files, more are planned be supported in the future.

## Config

### site

The directory where your build output lives, this is required for both pagefind and this plugin.

### assets_dir

The directory where the static assets are located relative to the project's root as specified in the Vite config.

_default_: 'public'

### pagefind_dir

The directory part of the URL you use to import the pagefind script on your site. For example, if you use `/pagefind/pagefind.js`, the `pagefind_dir` is `pagefind`. If you use `/search/static/pagefind/pagefind.js`, the `pagefind_dir` is `search/static/pagefind`.

_default_: 'pagefind'

### build_command

The command to build and index the project.

_default_: 'npm run build'

### dev_strategy

The indexing strategy used during development:

- "eager": Build and index the app every time the development server starts
- "lazy": Build and index the app only if the pagefind bundle isn't present already

_default_: 'lazy'

## Types

Apart from the plugin, this package also exposes [the types from pagefind](https://github.com/CloudCannon/pagefind/blob/production-docs/pagefind_web_js/types/index.d.ts) as well as extending them by providing an additional `Pagefind` type:

```ts
import type { Pagefind } from "vite-plugin-pagefind/types";

const pagefind: Pagefind = await import("/pagefind/pagefind.js");
```

## Pagefind

For further questions regarding Pagefind itself you can refer to [the official docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.
