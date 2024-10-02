<template>
  <div class="container">
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: officePercentage + '%', backgroundColor: progressBarColor }"></div>
      <span class="progress-text">{{ officePercentage.toFixed(1) }}%</span>
      <span class="remaining-time" v-if="remainingTime > 0">
        {{ formatRemainingTimeShort(remainingTime) }}
      </span>
    </div>
    <div class="content">
      <div class="month-picker">
        <button @click="changeMonth(-1)">Previous</button>
        <span>{{ currentMonthYear }}</span>
        <button @click="changeMonth(1)">Next</button>
      </div>
      <div class="cards-container">
        <template v-for="(item, index) in daysAndDividers" :key="index">
          <WeekDivider v-if="item.type === 'divider'" :weekNumber="item.weekNumber" />
          <DayCard
            v-else
            :day="item"
            @update:type="updateDayType(item.date, $event)"
            @update:hours="updateDayHours(item.date, $event)"
          />
        </template>
      </div>
      <div class="reset-buttons">
        <button @click="clearCurrentMonth">Clear Current Month</button>
        <button @click="clearAllData">Clear All Data</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DayCard from '~/components/DayCard.vue'
import WeekDivider from '~/components/WeekDivider.vue'
import { isHoliday, getHolidayName } from '~/utils/holidays'

/**
 * Work Schedule Application
 * 
 * This is the main page component for the Work Schedule application.
 * It manages the current month's view, generates the days to be displayed,
 * and handles local storage for persisting user selections.
 */

// Current date reference, used to determine which month to display
const currentDate = ref(new Date())

// Add a reactive reference to trigger updates
const updateTrigger = ref(0)

// Function to get stored data from local storage
const getStoredData = (date) => {
  const storedData = localStorage.getItem(date)
  return storedData ? JSON.parse(storedData) : { type: 'home', minutes: 480 }  // 8 hours = 480 minutes
}

// Function to store data in local storage
const storeData = (date, data) => {
  localStorage.setItem(date, JSON.stringify(data))
}

/**
 * Computed property that generates an array of day objects for the current month.
 * Now reactive to changes in updateTrigger.
 */
const daysAndDividers = ref([])

const updateDaysAndDividers = () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const daysInMonthCount = new Date(year, month + 1, 0).getDate()
  
  const items = []
  let currentWeek = null
  let firstWorkdayFound = false

  for (let i = 1; i <= daysInMonthCount; i++) {
    const date = new Date(year, month, i)
    const dayOfWeek = date.getDay()
    const weekNumber = getWeekNumber(date)

    // Add day card if it's a workday (Monday to Friday) or a holiday
    if (dayOfWeek >= 1 && dayOfWeek <= 5 || isHoliday(date.toISOString().split('T')[0])) {
      // Add week divider if it's a new week and we've found the first workday
      if (weekNumber !== currentWeek && firstWorkdayFound) {
        items.push({ type: 'divider', weekNumber })
      }
      
      if (!firstWorkdayFound) {
        firstWorkdayFound = true
        items.push({ type: 'divider', weekNumber })
      }

      currentWeek = weekNumber

      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      const dateString = date.toISOString().split('T')[0]
      const storedData = getStoredData(dateString)
      const holidayName = getHolidayName(dateString)

      items.push({
        type: 'day',
        date: dateString,
        workType: holidayName ? 'holiday' : storedData.type,
        minutes: holidayName ? 480 : storedData.minutes,
        isHoliday: !!holidayName,
        holidayName: holidayName
      })
    }
  }

  daysAndDividers.value = items
}

// Function to get the week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}

/**
 * Computed property that returns the current month and year as a formatted string.
 * 
 * @returns {string} Formatted month and year (e.g., "October 2023")
 */
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

/**
 * Computed property that calculates the office time percentage.
 * This property now includes sick/vacation days as office time.
 * 
 * @returns {number} Percentage of office time
 */
const officePercentage = computed(() => {
  const workingDays = daysAndDividers.value.filter(item => 
    item.type === 'day' && !item.isHoliday
  )
  const totalWorkMinutes = workingDays.length * 480 // 8 hours = 480 minutes per working day
  const officeMinutes = workingDays.reduce((sum, day) => {
    if (day.workType === 'office') {
      return sum + day.minutes
    } else if (day.workType === 'sick-vacation') {
      return sum + 480
    }
    return sum
  }, 0)
  return totalWorkMinutes > 0 ? (officeMinutes / totalWorkMinutes) * 100 : 0
})

const remainingTime = computed(() => {
  if (officePercentage.value >= 40) return 0
  const workingDays = daysAndDividers.value.filter(item => 
    item.type === 'day' && !item.isHoliday
  )
  const totalWorkMinutes = workingDays.length * 480
  const currentOfficeMinutes = workingDays.reduce((sum, day) => {
    if (day.workType === 'office') {
      return sum + day.minutes
    } else if (day.workType === 'sick-vacation') {
      return sum + 480
    }
    return sum
  }, 0)
  const requiredOfficeMinutes = totalWorkMinutes * 0.4
  return Math.max(0, Math.ceil(requiredOfficeMinutes - currentOfficeMinutes))
})

function formatRemainingTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

function formatRemainingTimeShort(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Computed property that determines the color of the progress bar.
 * 
 * @returns {string} Color value for the progress bar
 */
const progressBarColor = computed(() => {
  return officePercentage.value >= 40 ? '#4CAF50' : '#FF9800'
})

/**
 * Changes the current month by the specified delta.
 * 
 * @param {number} delta - The number of months to change by (positive or negative)
 */
function changeMonth(delta) {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
  updateDaysAndDividers()
}

/**
 * Updates the work type for a specific day and stores it in local storage.
 * 
 * @param {string} date - The date in ISO format (YYYY-MM-DD)
 * @param {string} newType - The new work type ('home' or 'office')
 */
function updateDayType(date, newType) {
  const dayIndex = daysAndDividers.value.findIndex(item => item.type === 'day' && item.date === date)
  if (dayIndex !== -1) {
    daysAndDividers.value[dayIndex].workType = newType
    if (newType === 'sick-vacation') {
      daysAndDividers.value[dayIndex].minutes = 480
    }
    storeData(date, { type: newType, minutes: daysAndDividers.value[dayIndex].minutes })
  }
}

/**
 * Updates the work hours for a specific day and stores it in local storage.
 * 
 * @param {string} date - The date in ISO format (YYYY-MM-DD)
 * @param {number} newMinutes - The new work minutes
 */
function updateDayHours(date, newMinutes) {
  const dayIndex = daysAndDividers.value.findIndex(item => item.type === 'day' && item.date === date)
  if (dayIndex !== -1) {
    daysAndDividers.value[dayIndex].minutes = newMinutes
    storeData(date, { type: daysAndDividers.value[dayIndex].workType, minutes: newMinutes })
  }
}

/**
 * Clears the data for the current month in local storage
 */
function clearCurrentMonth() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const daysInMonthCount = new Date(year, month + 1, 0).getDate()

  for (let i = 1; i <= daysInMonthCount; i++) {
    const date = new Date(year, month, i)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()) // Adjust for timezone
    const dateString = date.toISOString().split('T')[0]
    localStorage.removeItem(dateString)
  }
  updateDaysAndDividers()
}

/**
 * Clears all data in local storage
 */
function clearAllData() {
  localStorage.clear()
  updateDaysAndDividers()
}

// Watch for changes in the current date and update local storage accordingly
watch(currentDate, updateDaysAndDividers)

// Initialize data from local storage when the component is mounted
onMounted(() => {
  updateDaysAndDividers()
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 40px; /* Reduced padding to accommodate removed header */
}

.progress-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: #f0f0f0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Added shadow */
}

.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.progress-text {
  position: relative;
  z-index: 1;
  font-weight: bold;
  color: #333;
}

.remaining-time {
  position: relative;
  z-index: 1;
  font-weight: bold;
  color: #333;
}

.content {
  padding: 10px; /* Reduced padding */
}

.month-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Reduced margin */
}

.month-picker button {
  background-color: #3498db; /* Changed to a blue color */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.month-picker button:hover {
  background-color: #2980b9;
}

.month-picker span {
  font-size: 1.2em;
  font-weight: bold;
  color: #333; /* Changed to a darker color for better contrast */
}

.cards-container {
  width: 100%;
  padding: 0;
  margin: 0;
}

.reset-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.reset-buttons button {
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-buttons button:hover {
  background-color: #c0392b;
}
</style>