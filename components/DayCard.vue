<template>
  <div class="day-card-container">
    <!-- The main card container with dynamic class for flipping -->
    <div class="day-card" :class="{ 'is-flipped': isFlipped }" @click="flipCard">
      <div class="day-card-inner">
        <!-- Front face of the card -->
        <div class="day-card-face front">
          <div class="day-info">
            <div class="weekday">{{ weekdayAbbreviation }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
          <!-- Display current work type with emoji -->
          <div class="work-type">{{ workTypeWithEmoji(currentType) }}</div>
          <div class="hours" @click.stop="toggleHoursSelector">{{ formatHours(props.day.hours) }}</div>
        </div>
        <!-- Back face of the card -->
        <div class="day-card-face back">
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
import { ref, computed } from 'vue'
import HoursSelector from './HoursSelector.vue'

const props = defineProps(['day'])
const emit = defineEmits(['update:type', 'update:hours'])

// State for UI interactions
const showHoursSelector = ref(false)
const isFlipped = ref(false)
// Track the current work type independently of props
const currentType = ref(props.day.type)

// Computed properties for formatting date information
const weekdayAbbreviation = computed(() => {
  const date = new Date(props.day.date)
  return date.toLocaleString('en-US', { weekday: 'short' })
})

const formattedDate = computed(() => {
  const date = new Date(props.day.date)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
})

// Compute the opposite work type for the flip animation
const flippedType = computed(() => currentType.value === 'home' ? 'office' : 'home')

// Add emoji to work type for visual enhancement
function workTypeWithEmoji(type) {
  return type === 'home' ? '🏠 Home' : '🏢 Office'
}

// Handle the card flip animation and type update
function flipCard() {
  // Start the flip animation
  isFlipped.value = true
  
  // Update the type and emit the change halfway through the animation
  // This creates a smooth transition effect
  setTimeout(() => {
    currentType.value = flippedType.value
    emit('update:type', currentType.value)
    // Reset the flip state to prepare for the next interaction
    isFlipped.value = false
  }, 150) // 150ms is half of the 300ms animation duration
}

// Toggle the hours selector, stopping event propagation to prevent card flip
function toggleHoursSelector(event) {
  event.stopPropagation()
  showHoursSelector.value = !showHoursSelector.value
}

// Update hours and close the selector
function updateHours(newHours) {
  emit('update:hours', newHours)
  showHoursSelector.value = false
}

// Format hours for display (e.g., "08:30")
function formatHours(hours) {
  const wholeHours = Math.floor(hours)
  const minutes = (hours % 1) * 60
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/* Card container styles */
.day-card-container {
  margin-bottom: 16px;
}

/* 3D space for the card flip animation */
.day-card {
  perspective: 1000px;
  height: 60px;
}

/* Inner card container for 3D transform */
.day-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.45, 0, 0.55, 1);
  transform-style: preserve-3d;
}

/* Apply 180-degree rotation when flipped */
.day-card.is-flipped .day-card-inner {
  transform: rotateX(180deg);
}

/* Styles for both front and back faces */
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
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Rotate back face to be hidden initially */
.day-card-face.back {
  transform: rotateX(180deg);
}

/* Layout for date information */
.day-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Typography styles */
.weekday {
  font-size: 0.9em;
  font-weight: bold;
  color: #333;
}

.date {
  font-size: 0.8em;
  color: #666;
}

.work-type {
  font-size: 1.1em;
  font-weight: bold;
  text-transform: capitalize;
}

.hours {
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
}
</style>