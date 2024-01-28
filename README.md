# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into vite projects.

## Prerequisites

-   Ensure [Pagefind](https://github.com/CloudCannon/pagefind) is installed.

## Installation

Install from npm using your preffered package manager:

```bash
pnpm add -D vite-plugin-pagefind
```

## Usage

Add the plugin to your vite config:

```ts
import { defineConfig } from 'vite';
import { pagefind, type PagefindConfig } from 'vite-plugin-pagefind';

const pagefindConfig: PagefindConfig = {
	appDir: '...',
	buildDir: '...',
	cwd: '...'
};

export default defineConfig({
	// Config...
	plugins: [, /* Plugins.. */ pagefind(pagefindConfig)]
});
```

## Config

### appDir

Provide a directory where you want pagefind to be placed during development.

Example: `appDir: 'static'` results in: `static/pagefind/pagefind.js`

_Default_: -

### buildDir

Optionally provide a directory where you want pagefind to run after your app has been build.

Example: `buildDir: 'public'` results in: `public/pagefind/pagefind.js`

_Default_: "build"

### cwd

Optionally provide a directory where the plugin should run from.

_Default_: `process.cwd()`

## Features

### What this plugin does do

-   Ensures pagefind is ran on your build output after building.
-   Ensures pagefind is present during development.

### What this plugin doesn't do

-   Provide a way to use pagefind in your code.
