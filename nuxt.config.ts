import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    'get-bonus': fileURLToPath(new URL('./packages/get-bonus/src/index.ts', import.meta.url))
  }
});
