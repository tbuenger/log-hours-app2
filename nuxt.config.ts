export default defineNuxtConfig({
  target: 'static',
  ssr: false,
  app: {
    head: {
      title: 'Log Hours App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Work-from-home and office hours tracking app' }
      ]
    }
  },
  modules: [
    '@vite-pwa/nuxt'  // Add this line
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Log Hours App',
      short_name: 'LogHours',
      lang: 'en',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4a90e2',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
})