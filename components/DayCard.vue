<template>
  <div class="day-card-container">
    <!-- The main card container with dynamic class for flipping -->
    <div class="day-card" :class="{ 'is-flipped': isFlipped }" @click="flipCard">
      <div class="day-card-inner">
        <!-- Front face of the card -->
        <div class="day-card-face front" :class="currentType">
          <div class="day-info">
            <div class="weekday">{{ weekdayAbbreviation }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
          <!-- Display current work type with emoji -->
          <div class="work-type">{{ workTypeWithEmoji(currentType) }}</div>
          <div class="hours" @click.stop="toggleHoursSelector">{{ formatHours(props.day.hours) }}</div>
        </div>
        <!-- Back face of the card -->
        <div class="day-card-face back" :class="flippedType">
          <div class="day-info">
            <div class="weekday">{{ weekdayAbbreviation }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
          <!-- Display flipped (opposite) work type with emoji -->
          <div class="work-type">{{ workTypeWithEmoji(flippedType) }}</div>
          <div class="hours" @click.stop="toggleHoursSelector">{{ formatHours(props.day.hours) }}</div>
        </div>
      </div>
    </div>
    <!-- Hours selector component, shown when toggled -->
    <HoursSelector 
      v-if="showHoursSelector" 
      :hours="props.day.hours" 
      @update:hours="updateHours" 
      @close="showHoursSelector = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import HoursSelector from './HoursSelector.vue'

/**
 * DayCard Component
 * 
 * This component represents a single day in the work schedule.
 * It displays the date, work type (home/office), and work hours.
 * The card can be flipped to change the work type.
 * 
 * Key Concepts:
 * 1. Flip Animation: The card uses a 3D flip animation to switch between work types.
 * 2. Two-Face Card: The card has a front and back face, each showing different work types.
 * 3. Delayed Update: The type update is delayed to coincide with the flip animation.
 * 
 * Important: The flip mechanism is designed to visually represent the change before
 * actually updating the data. This prevents visual glitches and ensures a smooth transition.
 */

const props = defineProps(['day'])
const emit = defineEmits(['update:type', 'update:hours'])

// UI state
const showHoursSelector = ref(false)
const isFlipped = ref(false)

// CRITICAL: This ref tracks the current work type independently of props
// It's updated via a watcher when the prop changes, allowing for smooth transitions
const currentType = ref(props.day.workType || 'home')

// Computed properties for date formatting
const weekdayAbbreviation = computed(() => {
  const date = new Date(props.day.date)
  return date.toLocaleString('en-US', { weekday: 'short' })
})

const formattedDate = computed(() => {
  const date = new Date(props.day.date)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
})

/**
 * Computed property that returns the opposite work type.
 * This is used for the back face of the card during the flip animation.
 * 
 * @returns {string} The opposite work type ('home' or 'office')
 */
const flippedType = computed(() => currentType.value === 'home' ? 'office' : 'home')

/**
 * Adds an emoji to the work type for visual enhancement.
 * 
 * @param {string} type - The work type ('home' or 'office')
 * @returns {string} Work type with emoji
 */
function workTypeWithEmoji(type) {
  return type === 'home' ? '🏠 Home' : '🏢 Office'
}

/**
 * Handles the card flip animation and type update.
 * 
 * IMPORTANT: This function is crucial for the correct behavior of the flip animation.
 * It follows these steps:
 * 1. Trigger the flip animation by toggling `isFlipped`.
 * 2. Emit the type update after a delay, allowing the animation to reach its midpoint.
 * 3. The actual data update occurs in the parent component, which then triggers the watcher.
 * 
 * This approach ensures that:
 * - The visual flip occurs immediately, providing instant feedback to the user.
 * - The data update happens at the right moment, preventing visual glitches.
 * - The component remains reactive to external updates via the watcher.
 */
function flipCard() {
  isFlipped.value = true
  
  setTimeout(() => {
    currentType.value = flippedType.value
    emit('update:type', currentType.value)
    isFlipped.value = false
  }, 150) // 150ms is half of the 300ms animation duration
}

// Other utility functions
function toggleHoursSelector(event) {
  event.stopPropagation()
  showHoursSelector.value = !showHoursSelector.value
}

function updateHours(newHours) {
  emit('update:hours', newHours)
}

function formatHours(hours) {
  const wholeHours = Math.floor(hours)
  const minutes = (hours % 1) * 60
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * Watcher for changes in the day.type prop.
 * This is crucial for maintaining consistency between props and local state.
 * 
 * When the parent component updates the type (as a result of our emit in flipCard),
 * this watcher ensures that our local currentType ref is updated accordingly.
 * This allows the component to react to both internal changes (via flipCard) 
 * and external changes (via prop updates).
 */
watch(() => props.day.workType, (newType) => {
  currentType.value = newType
})

onMounted(() => {
  currentType.value = props.day.workType || 'home'
})
</script>

<style scoped>
.day-card-container {
  width: calc(100% - 20px);
  margin: 0 0 16px;
  display: flex;
  justify-content: center;
}

.day-card {
  width: 100%;
  max-width: 360px;
  perspective: 1000px;
  height: 60px;
  margin: 0 auto;
}

.day-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.45, 0, 0.55, 1);
  transform-style: preserve-3d;
}

.day-card.is-flipped .day-card-inner {
  transform: rotateX(180deg);
}

.day-card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--card-border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
}

.day-card-face.front {
  transform: rotateX(0deg);
}

.day-card-face.back {
  transform: rotateX(180deg);
}

.day-card-face.home {
  background-color: var(--card-bg-color-home, #f4f8f0);
}

.day-card-face.office {
  background-color: var(--card-bg-color-office, #f0f4f8);
}

.day-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.weekday {
  font-size: 0.9em;
  font-weight: bold;
}

.date {
  font-size: 0.8em;
  color: #666;
}

.work-type, .hours {
  font-size: 1em;
  font-weight: bold;
}

.hours {
  cursor: pointer;
}
</style>