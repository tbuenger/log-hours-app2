<template>
  <div class="container">
    <ProgressBar 
      :percentage="officePercentage" 
      :remaining-time="remainingTime"
    />
    <div class="content">
      <MonthPicker 
        :current-month-year="currentMonthYear" 
        @change-month="changeMonth"
      />
      <DayCardList 
        :days-and-dividers="daysAndDividers" 
        @update:type="updateDayType" 
        @update:hours="updateDayHours"
      />
      <ResetButtons 
        @clear-current-month="clearCurrentMonth" 
        @clear-all-data="clearAllData"
      />
      <button v-if="showInstallPrompt" @click="installPWA" class="install-button">
        Install App
      </button>
      <div v-if="isIOS" class="ios-install-guide">
        <p>To install this app on your iPhone:</p>
        <ol>
          <li>Tap the Share button <span class="icon">􀈂</span> at the bottom of the screen.</li>
          <li>Scroll down and tap "Add to Home Screen".</li>
          <li>Tap "Add" in the top right corner.</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useWorkSchedule } from '~/composables/useWorkSchedule'
import ProgressBar from '~/components/ProgressBar.vue'
import MonthPicker from '~/components/MonthPicker.vue'
import DayCardList from '~/components/DayCardList.vue'
import ResetButtons from '~/components/ResetButtons.vue'

const { 
  currentDate,
  daysAndDividers,
  officePercentage,
  remainingTime,
  currentMonthYear,
  changeMonth,
  updateDayType,
  updateDayHours,
  clearCurrentMonth,
  clearAllData,
  updateDaysAndDividers
} = useWorkSchedule()

const showInstallPrompt = ref(false)
let deferredPrompt = null

const isIOS = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
})

onMounted(() => {
  updateDaysAndDividers()
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallPrompt.value = true
  })
})

watch(currentDate, updateDaysAndDividers)

const installPWA = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      deferredPrompt = null
      showInstallPrompt.value = false
    })
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top);
}

.content {
  padding: 10px;
}

.install-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.install-button:hover {
  background-color: #2980b9;
}

.ios-install-guide {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f4f8;
  border-radius: 8px;
  font-size: 0.9em;
}

.ios-install-guide ol {
  padding-left: 20px;
}

.ios-install-guide .icon {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>