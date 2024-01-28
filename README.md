# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into Vite based projects.

## Prerequisites

-   Ensure [Pagefind](https://github.com/CloudCannon/pagefind) is installed.

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
	appDir: '...',
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

## Features

-   Ensures pagefind is present during development.
-   Ensures pagefind after building your app.
-   Ensures pagefind can be safely used through dynamic imports.

## Pagefind

For further questions regarding Pagefind itself you can refer to [the offical docs](https://pagefind.app/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
