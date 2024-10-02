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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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
  updateDayType,
  updateDayHours,
  clearCurrentMonth,
  clearAllData,
  updateDaysAndDividers
} = useWorkSchedule()

const changeMonth = (change) => {
  if (typeof change === 'number') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + change, 1)
  } else if (change instanceof Date) {
    currentDate.value = new Date(change.getFullYear(), change.getMonth(), 1)
  }
  updateDaysAndDividers()
}

const showInstallPrompt = ref(false)
let deferredPrompt = null

onMounted(() => {
  updateDaysAndDividers()
  
  if (process.client) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      showInstallPrompt.value = true
    })
  }
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
  padding-top: 60px; /* Add padding to the top of the content */
}

.install-button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #4CAF50; /* More vibrant green */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.install-button:hover {
  background-color: #45a049;
}

.ios-install-guide {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e9; /* Light green background */
  border-radius: 8px;
  font-size: 0.9em;
  border: 1px solid #c8e6c9;
}

.ios-install-guide ol {
  padding-left: 20px;
}

.ios-install-guide .icon {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>