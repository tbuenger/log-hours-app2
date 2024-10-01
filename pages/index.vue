<template>
    <div class="work-hours-tracker">
      <div class="month-selector">
        <button @click="previousMonth">&lt;</button>
        <h2>{{ currentMonthYear }}</h2>
        <button @click="nextMonth">&gt;</button>
      </div>
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else class="day-cards-container">
        <DayCard 
          v-for="day in daysInMonth" 
          :key="day.date" 
          :day="day" 
          @update:hours="updateHours(day.date, $event)" 
          @update:type="updateType(day.date, $event)" 
        />
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DayCard from '~/components/DayCard.vue'

const currentDate = ref(new Date())
const isLoading = ref(true)
const monthData = ref([])

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1)
    const dateString = formatDate(date)
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      return null
    }
    const savedDay = monthData.value.find(d => d.date === dateString)
    return savedDay || {
      date: dateString,
      type: 'home',
      hours: 8
    }
  }).filter(day => day !== null) // Remove null entries (weekends)
})

function formatDate(date) {
  const offset = date.getTimezoneOffset()
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
  return adjustedDate.toISOString().split('T')[0]
}

function previousMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1)
}

function nextMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1)
}

function updateHours(date, newHours) {
  const day = monthData.value.find(d => d.date === date)
  if (day) {
    day.hours = newHours
  } else {
    monthData.value.push({ date, hours: newHours, type: 'home' })
  }
  saveData()
}

function updateType(date, newType) {
  const dayIndex = monthData.value.findIndex(d => d.date === date)
  if (dayIndex !== -1) {
    monthData.value = [
      ...monthData.value.slice(0, dayIndex),
      { ...monthData.value[dayIndex], type: newType },
      ...monthData.value.slice(dayIndex + 1)
    ]
  } else {
    monthData.value = [...monthData.value, { date, hours: 8, type: newType }]
  }
  saveData()
}

function saveData() {
  const monthKey = `logHoursData-${formatDate(currentDate.value)}`
  localStorage.setItem(monthKey, JSON.stringify(monthData.value))
}

async function loadData() {
  isLoading.value = true
  const monthKey = `logHoursData-${formatDate(currentDate.value)}`
  const savedData = localStorage.getItem(monthKey)
  if (savedData) {
    monthData.value = JSON.parse(savedData)
  } else {
    monthData.value = []
  }
  isLoading.value = false
}

onMounted(async () => {
  await loadData()
})

watch(currentDate, async () => {
  await loadData()
})
</script>

<style scoped>
.work-hours-tracker {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-selector button {
  font-size: 1.5em;
  background: none;
  border: none;
  cursor: pointer;
}

.month-selector h2 {
  margin: 0;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
}

.day-cards-container {
  display: flex;
  flex-direction: column;
}
</style>