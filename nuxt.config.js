export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@vite-pwa/nuxt'
  ],
  app: {
    head: {
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' }, // Add this line
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Home or Office' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
        { rel: 'apple-touch-startup-image', href: '/splash.png' },
      ],
    },
  },
  pwa: {
    manifest: {
      name: 'Home or Office Scheduling App',
      short_name: 'Home or Office',
      lang: 'en',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#3498db',
      background_color: '#ffffff',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/icon-1024x1024.png',
          sizes: '1024x1024',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})