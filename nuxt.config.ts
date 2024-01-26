import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', 'shadcn-nuxt', '@nuxt/image', 'unplugin-info/nuxt'],
  alias: {
    'get-bonus': fileURLToPath(new URL('./packages/get-bonus/src/index.ts', import.meta.url))
  },
  css: ['@unocss/reset/tailwind.css'],
  app: {
    head: {
      title: '特典获取 | 百合研社团',
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      meta: []
    }
  },
  image: {
    domains: [
      'melonbooks.co.jp',
      'melonbooks.akamaized.net',
      'animate.co.jp',
      'toranoana.jp',
      'ecdnimg.toranoana.jp',
      'ecs.toranoana.jp',
      'gamers.co.jp',
      'tc-gamers.techorus-cdn.com',
      'comiczin.jp',
      'shop.comiczin.jp',
      'mangaoh.co.jp',
      'img.mangaoh.jp'
    ]
  },
  unocss: {
    preflight: true
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
});
