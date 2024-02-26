import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: true,
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    'unplugin-info/nuxt'
  ],
  components: [
    {
      path: '~/components/common',
      pathPrefix: false
    },
    {
      path: '~/components/docs',
      pathPrefix: false
    },
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  alias: {
    'get-bonus': fileURLToPath(new URL('./packages/get-bonus/src/index.ts', import.meta.url))
  },
  css: ['@unocss/reset/tailwind.css', './assets/fonts.css', './assets/vitepress.css'],
  app: {
    head: {
      title: '百合花船·特典搜索',
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      meta: [],
      script: [
        {
          type: 'text/javascript',
          children: `(function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', 'kw32lgez2o');`
        }
      ]
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
  },
  colorMode: {
    classSuffix: ''
  },
  info: {
    meta: {
      // ...
    }
  }
});
