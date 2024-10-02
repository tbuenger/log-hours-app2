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
  changeMonth,
  updateDayType,
  updateDayHours,
  clearCurrentMonth,
  clearAllData,
  updateDaysAndDividers
} = useWorkSchedule()

const showInstallPrompt = ref(false)
let deferredPrompt = null

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
  padding-top: 40px;
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
</style>