# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into Vite based projects.

## Features

-   Ensures pagefind is present during development.
-   Ensures pagefind can be safely used through dynamic imports in conjunction with Vite.

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
import { defineConfig } from 'vite';
import pagefind from 'vite-plugin-pagefind';

export default defineConfig({
	plugins: [pagefind()]
});
```

Note: If your framework does not have a `vite.config` checkout the [examples](#examples), if your framework is not listed there consider consulting the framework documentation to see how to add a Vite plugin.

2. Add the post build command to your `package.json`:

```json
{
	"scripts": {
		"build": "vite build && pagefind"
	}
}
```

3. Add the `pagefind.json` config to your project:

```json
{
	"site": "<BUILD_DIR>",
	"vite_plugin_pagefind": {
		"assets_dir": "<ASSETS_DIR>",
		"build_command": "<BUILD_COMMAND>",
		"dev_strategy": "<DEV_STRATEGY>"
	}
}
```

Note: `vite-plugin-pagefind` currently only supports `.json` files, more will be supported in the future.

## Config

### site

The directory where your build output lives, this is required for both pagefind and this plugin.

### assets_dir

The directory where the static assets are located relative to the project's root as specified in the vite config.

_default_: 'public'

### build_command

The command to build and index the project.

_default_: 'npm run build'

### dev_strategy

The indexing strategy used during development:

-   "eager": Build and index the app every time the development server starts
-   "lazy": Build and index the app only if the pagefind bundle isn't present already

_default_: 'lazy'

## Types

Apart from the plugin, this package also exposes [the types from pagefind](https://github.com/CloudCannon/pagefind/blob/production-docs/pagefind_web_js/types/index.d.ts) as well as extending them by providing an additional `Pagefind` type:

```ts
import type { Pagefind } from 'vite-plugin-pagefind/types';

const pagefind: Pagefind = await import('/pagefind/pagefind.js');
```

## Examples

COMING SOON

## Pagefind

For further questions regarding Pagefind itself you can refer to [the offical docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
