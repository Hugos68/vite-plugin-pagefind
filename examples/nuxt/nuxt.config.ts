import { pagefind } from 'vite-plugin-pagefind'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    static: true
  },
  vite: {
    plugins: [pagefind()]
  }
})
