import { defineConfig } from 'astro/config';
import { pagefind } from 'vite-plugin-pagefind';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [pagefind()]
    }
});
