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
import { pagefind, type Config } from 'vite-plugin-pagefind';

const config: Config = {
	assetsDir: '...',
	buildDir: '...',
	buildScript: '...'
};

export default defineConfig({
	plugins: [pagefind(config)]
});
```

Note: If your framework does not have a `vite.config` checkout the [examples](#examples), if your framework is not listed there consider consulting the framework documentation to see how to add a Vite plugin.

2. Add the post build command to your `package.json`:

```json
{
	"scripts": {
		"build": "vite build && pagefind --site <BUILD_DIR>"
	}
}
```

Note: Replace `<BUILD_DIR>` with your build directory.

## Config

### assetsDir

The directory where the static assets are located relative to the project's root as specified in the vite config.

Example: `assetsDir: 'public'` results in: `public/pagefind/pagefind.js`

_default:_ 'public'

### buildDir

The directory where the build output is located relative to the project's root as specified in the vite config.

Example: `buildDir: 'dist'` results in: `dist/pagefind/pagefind.js`

_default:_ 'dist'

### buildScript

The npm script to run to build and index the project.

_default:_ 'build'

## Examples

The setup for individual frameworks can differ (For example Astro, which has it's own CLI around Vite), because of this there are framework specific examples in the [examples folder](examples/):

-   [Astro](examples/astro/)
-   [Nuxt](examples/nuxt/)
-   [SvelteKit](examples/sveltekit/)

Don't see your framework? Consider adding it through a contribution!

## Types

Besides the plugin, this package also exposes [the types from pagefind](https://github.com/CloudCannon/pagefind/blob/production-docs/pagefind_web_js/types/index.d.ts) as well as extending them by providing an additional `Pagefind` type:

```ts
const pagefind: Pagefind = await import('/pagefind/pagefind.js');
```

## Pagefind

For further questions regarding Pagefind itself you can refer to [the offical docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
