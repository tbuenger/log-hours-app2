<template>
    <div class="container">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: officePercentage + '%', backgroundColor: progressBarColor }"></div>
        <span class="progress-text">{{ officePercentage.toFixed(1) }}% Office Time</span>
      </div>
      <div class="month-picker">
        <button @click="changeMonth(-1)">Previous</button>
        <span>{{ currentMonthYear }}</span>
        <button @click="changeMonth(1)">Next</button>
      </div>
      <div class="cards-container">
        <DayCard
          v-for="day in daysInMonth"
          :key="day.date"
          :day="day"
          @update:type="updateDayType(day.date, $event)"
          @update:hours="updateDayHours(day.date, $event)"
        />
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DayCard from '~/components/DayCard.vue'

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
  return storedData ? JSON.parse(storedData) : { type: 'home', hours: 8 }
}

// Function to store data in local storage
const storeData = (date, data) => {
  localStorage.setItem(date, JSON.stringify(data))
}

/**
 * Computed property that generates an array of day objects for the current month.
 * Now reactive to changes in updateTrigger.
 */
const daysInMonth = ref([])

const updateDaysInMonth = () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const daysInMonthCount = new Date(year, month + 1, 0).getDate()
  
  daysInMonth.value = Array.from({ length: daysInMonthCount }, (_, i) => {
    const date = new Date(year, month, i + 1)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    const dateString = date.toISOString().split('T')[0]
    const storedData = getStoredData(dateString)
    return {
      date: dateString,
      type: storedData.type,
      hours: storedData.hours
    }
  })
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
 * This property now depends on both the work type and hours of each day.
 * 
 * @returns {number} Percentage of office time
 */
const officePercentage = computed(() => {
  const workingDays = daysInMonth.value.filter(day => {
    const dayOfWeek = new Date(day.date).getDay()
    return dayOfWeek !== 0 && dayOfWeek !== 6 // Exclude weekends
  })

  const totalWorkHours = workingDays.length * 8 // 8 hours per working day
  const officeHours = workingDays.reduce((sum, day) => {
    return sum + (day.type === 'office' ? day.hours : 0) // Use actual hours for office days
  }, 0)

  return (officeHours / totalWorkHours) * 100
})

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
}

/**
 * Updates the work type for a specific day and stores it in local storage.
 * 
 * @param {string} date - The date in ISO format (YYYY-MM-DD)
 * @param {string} newType - The new work type ('home' or 'office')
 */
function updateDayType(date, newType) {
  const dayIndex = daysInMonth.value.findIndex(day => day.date === date)
  if (dayIndex !== -1) {
    daysInMonth.value[dayIndex].type = newType
    storeData(date, { ...daysInMonth.value[dayIndex] })
    updateTrigger.value++
  }
}

/**
 * Updates the work hours for a specific day and stores it in local storage.
 * 
 * @param {string} date - The date in ISO format (YYYY-MM-DD)
 * @param {number} newHours - The new work hours
 */
function updateDayHours(date, newHours) {
  const dayIndex = daysInMonth.value.findIndex(day => day.date === date)
  if (dayIndex !== -1) {
    daysInMonth.value[dayIndex].hours = newHours
    storeData(date, { ...daysInMonth.value[dayIndex] })
    updateTrigger.value++
  }
}

// Watch for changes in the current date and update local storage accordingly
watch(currentDate, updateDaysInMonth)

// Initialize data from local storage when the component is mounted
onMounted(() => {
  updateDaysInMonth()
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 60px; /* Make room for the fixed progress bar */
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
  padding: 0 20px;
}

.progress-bar {
  height: 20px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.progress-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: #333;
}

.month-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-picker button {
  background-color: var(--primary-color);
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
  color: var(--text-color);
}

.cards-container {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>