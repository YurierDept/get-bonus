import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@unocss/nuxt'],
  devtools: { enabled: true },
  css: ['@unocss/reset/tailwind.css'],
  app: {
    head: {
      title: 'Get Bonus',
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      link: [{ rel: 'icon', href: '/favicon.svg' }],
      meta: []
    }
  },
  unocss: {
    preflight: true
  },
  alias: {
    'get-bonus': fileURLToPath(new URL('./packages/get-bonus/src/index.ts', import.meta.url))
  }
});
