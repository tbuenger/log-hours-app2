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
        />
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DayCard from '~/components/DayCard.vue'

/**
 * Work Schedule Application
 * 
 * This is the main page component for the Work Schedule application.
 * It manages the current month's view and generates the days to be displayed.
 */

// Current date reference, used to determine which month to display
const currentDate = ref(new Date())

/**
 * Computed property that generates an array of day objects for the current month.
 * Each day object contains:
 * - date: The date in ISO format (YYYY-MM-DD)
 * - type: Randomly assigned work type ('office' or 'home')
 * - hours: Default work hours (set to 8)
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
    days.push({
      date: date.toISOString().split('T')[0],
      type: ['office', 'home'][Math.floor(Math.random() * 2)],
      hours: 8
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