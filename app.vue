<template>
  <div>
    <NuxtLayout>
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

useHead({
  title: 'Work Schedule App',
  meta: [
    { name: 'description', content: 'Track your work schedule and office time with ease' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
  ],
  link: [
    { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' }
  ]
})

const { updateServiceWorker } = useRegisterSW()
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

/* Responsive font sizes */
@media screen and (max-width: 374px) {
  body {
    font-size: 14px;
  }
}

@media screen and (min-width: 375px) and (max-width: 767px) {
  body {
    font-size: 16px;
  }
}

@media screen and (min-width: 768px) {
  body {
    font-size: 18px;
  }
}

/* Utility classes for font sizes */
.text-xs { font-size: 0.8125em; }
.text-sm { font-size: 0.9375em; }
.text-base { font-size: 1em; }
.text-lg { font-size: 1.125em; }
.text-xl { font-size: 1.25em; }

/* Prevent text from overflowing */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
