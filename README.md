# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into Vite based projects.

## Features

-   Ensures pagefind is present during development.
-   Ensures pagefind is ran on your build output.
-   Ensures pagefind can be safely used through dynamic imports in conjunction with Vite.

## Installation

Install from npm using your preffered package manager:

```bash
pnpm add -D vite-plugin-pagefind
```

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { pagefind, type PagefindConfig } from 'vite-plugin-pagefind';

const pagefindConfig: PagefindConfig = {
	publicDir: '...',
	buildDir: '...'
};

export default defineConfig({
	// Config...
	plugins: [, /* Plugins.. */ pagefind(pagefindConfig)]
});
```

## Config

### publicDir

Provide the directory where your static assets live.

Example: `publicDir: 'static'` results in: `static/pagefind/pagefind.js`

### buildDir

Provide the directory where your build output lives.

Example: `buildDir: 'public'` results in: `public/pagefind/pagefind.js`

## Examples

Every framework implements their build and dev process slightly different, this is why there is an [examples folder](examples/) to demonstrate usage in a specific framework:

-   ### [sveltekit](examples/sveltekit/)

Don't see your framework? Consider adding it through a contribution!

## Pagefind

For further questions regarding Pagefind itself you can refer to [the offical docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
