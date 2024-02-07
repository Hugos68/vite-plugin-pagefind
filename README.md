# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into Vite based projects.

## Features

-   Ensures pagefind is present during development.
-   Ensures pagefind can be safely used through dynamic imports in conjunction with Vite.

## Why?

Read about the reasoning for this plugin here: https://hugokorte.pages.dev/articles/pagefind-with-vite

## Installation

Install from npm using your preferred package manager:

```bash
pnpm add -D pagefind vite-plugin-pagefind
```

## Usage

1. Add the plugin to in `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { pagefind, type PagefindConfig } from 'vite-plugin-pagefind';

const pagefindConfig: PagefindConfig = {
	publicDir: '...',
	buildDir: '...',
	buildScript: '...'
};

export default defineConfig({
	plugins: [pagefind(pagefindConfig)]
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

### publicDir

Provide the directory where your static assets live.

Example: `publicDir: 'public'` results in: `public/pagefind/pagefind.js`

_default:_ 'public'

### buildDir

Provide the directory where your build output lives.

Example: `buildDir: 'dist'` results in: `dist/pagefind/pagefind.js`

_default:_ 'dist'

### buildScript

Provide the script that builds your app.

_default:_ 'build'

## Examples

The setup for individual frameworks can differ (For example Astro, which has it's own CLI around Vite), because of this there are framework specific examples in the [examples folder](examples/):

-   [Astro](examples/astro/)
-   [Nuxt](examples/nuxt/)
-   [SvelteKit](examples/sveltekit/)

Don't see your framework? Consider adding it through a contribution!

## Pagefind

For further questions regarding Pagefind itself you can refer to [the offical docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
