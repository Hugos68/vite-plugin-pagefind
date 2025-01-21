# vite-plugin-pagefind

A Vite plugin for easily integrating [Pagefind](https://pagefind.app/) into [Vite](https://vite.dev/) based projects.

## Features

- Pagefind works during development.
- Pagefind can be safely imported.

## Installation

Install from npm using your preferred package manager:

```bash
pnpm add -D pagefind vite-plugin-pagefind
```

## Usage

1. Add the plugin to in `vite.config`:

```ts
import { defineConfig } from "vite";
import { pagefind } from "vite-plugin-pagefind";

export default defineConfig({
	plugins: [
		pagefind({
			outputDirectory: "<OUTPUT_DIRECTORY>",
			assetsDirectory: "<ASSETS_DIRECTORY>",
			bundleDirectory: "<BUNDLE_DIRECTORY>",
			buildScript: "<BUILD_SCRIPT>",
			developStrategy: "<DEVELOP_STRATEGY>",
		}),
	],
});
```

2. Add the post build step to your `<OUTPUT_DIRECTORY>` in your `package.json`:

```json
{
	"scripts": {
		"build": "vite build && pagefind --site \"<OUTPUT_DIRECTORY>\""
	}
}
```

## Config

### outputDirectory

The directory where the build output is located in.

_default_: 'build'

### assetsDirectory

The directory where the static assets are located in.

_default_: 'public'

### bundleDirectory

The directory where the pagefind bundle is located in.

_default_: 'pagefind'

### buildScript

The script that builds the app.

_default_: 'build'

### developStrategy

The indexing strategy used during development:

- "lazy": Build and index the output only if the bundle is not present.
- "eager": Build and index the output regardless of the bundle's presence.

_default_: 'lazy'

## Types

Aswell as the plugin, this package also exposes [the official Pagefind types](https://github.com/CloudCannon/pagefind/blob/production-docs/pagefind_web_js/types/index.d.ts):

```ts
import type { Pagefind } from "vite-plugin-pagefind/types";

const pagefind: Pagefind = await import("/pagefind/pagefind.js");
```

## Pagefind

For further questions regarding Pagefind itself you can refer to [their official docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.
