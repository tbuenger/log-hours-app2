<template>
    <div class="container">
      <div class="month-picker">
        <button @click="changeMonth(-1)">Previous</button>
        <span>{{ currentMonthYear }}</span>
        <button @click="changeMonth(1)">Next</button>
      </div>
      <div class="cards-container">
        <DayCard
          v-for="day in daysInMonth"
          :key="day.date"
          v-model:type="day.type"
          v-model:hours="day.hours"
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
 * Each day object contains:
 * - date: The date in ISO format (YYYY-MM-DD)
 * - type: Work type ('home' by default or retrieved from local storage)
 * - hours: Work hours (8 by default or retrieved from local storage)
 * 
 * @returns {Array} An array of day objects for the current month
 */
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Calculate the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    // Adjust for local timezone to ensure correct date representation
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    const dateString = date.toISOString().split('T')[0]
    const storedData = getStoredData(dateString)
    days.push({
      date: dateString,
      type: storedData.type,
      hours: storedData.hours
    })
  }
  return days
})

/**
 * Computed property that returns the current month and year as a formatted string.
 * 
 * @returns {string} Formatted month and year (e.g., "October 2023")
 */
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
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
  const storedData = getStoredData(date)
  storedData.type = newType
  storeData(date, storedData)
}

/**
 * Updates the work hours for a specific day and stores it in local storage.
 * 
 * @param {string} date - The date in ISO format (YYYY-MM-DD)
 * @param {number} newHours - The new work hours
 */
function updateDayHours(date, newHours) {
  const storedData = getStoredData(date)
  storedData.hours = newHours
  storeData(date, storedData)
}

// Watch for changes in the current date and update local storage accordingly
watch(currentDate, () => {
  daysInMonth.value.forEach(day => {
    const storedData = getStoredData(day.date)
    if (storedData.type !== day.type || storedData.hours !== day.hours) {
      storeData(day.date, { type: day.type, hours: day.hours })
    }
  })
})

// Initialize data from local storage when the component is mounted
onMounted(() => {
  daysInMonth.value.forEach(day => {
    const storedData = getStoredData(day.date)
    day.type = storedData.type
    day.hours = storedData.hours
  })
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
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