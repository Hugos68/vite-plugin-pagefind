# vite-plugin-pagefind

A Vite plugin for easily integrating pagefind into vite projects.

## Prerequisites

- Ensure pagefind is installed for your project.

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
  pagefindDir: '...',
  siteDir: '...',
  cwd: '...'
}

export default defineConfig({
  // ...
  plugins: [..., pagefind(pagefindConfig)] // Make s
});
```

## Features

### What this plugin does do

- Ensures pagefind is ran on your build output after building.
- Ensures pagefind is present during development.

### What this plugin doesn't do

- Provide a way to use pagefind in your code.


