<template>
  <div id="app-wrapper">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div v-if="offlineReady" class="pwa-toast">
      App ready to work offline
    </div>
    <div v-if="needRefresh" class="pwa-toast">
      New content available, click on reload button to update.
      <button @click="updateServiceWorker()">Reload</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useHead } from '#app'

useHead({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  meta: [
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Work Schedule' },
  ],
  link: [
    { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
    { rel: 'apple-touch-startup-image', href: '/splash.png' },
  ],
})

const { updateServiceWorker } = useRegisterSW({
  immediate: true,
  onOfflineReady() {
    offlineReady.value = true
  },
  onNeedRefresh() {
    needRefresh.value = true
  },
  onRegistered(swRegistration) {
    console.log('SW registered: ', swRegistration)
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  },
})

const offlineReady = ref(false)
const needRefresh = ref(false)
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f5f7; /* Subtle light grey background */
}

body {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

#app-wrapper {
  height: 100%;
  width: 100%;
  overflow-y: auto; /* Change this from 'auto' to 'scroll' */
  -webkit-overflow-scrolling: touch;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  box-sizing: border-box;
}

#__nuxt {
  height: 100%;
}

/* Disable text selection globally */
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Allow text selection for specific elements if needed */
.selectable {
  -webkit-touch-callout: default;
  -webkit-user-select: text;
  -khtml-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
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

.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1000;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: white;
}

.pwa-toast button {
  margin-top: 8px;
  padding: 4px 8px;
  border: 1px solid #8885;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}
</style>
