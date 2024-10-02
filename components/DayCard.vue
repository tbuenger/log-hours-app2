<template>
  <div class="day-card-container">
    <div 
      class="day-card" 
      :class="{ 'is-flipped': isFlipped, 'is-holiday': props.day.isHoliday, 'is-sick-vacation': currentType === 'sick-vacation' }" 
      @mousedown="startLongPress"
      @mouseup="handleMouseUp"
      @mouseleave="cancelLongPress"
      @touchstart="startLongPress"
      @touchend="handleTouchEnd"
      @touchcancel="cancelLongPress"
    >
      <div class="day-card-inner">
        <div class="day-card-face front" :class="currentType">
          <div class="day-info">
            <div class="weekday">{{ weekdayAbbreviation }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
          <div class="work-type">{{ workTypeWithEmoji(currentType) }}</div>
          <div v-if="showHours" class="hours" :class="{ 'non-editable': !isEditable }" @click.stop="toggleHoursSelector">
            {{ formatHours(props.day.hours) }}
          </div>
          <div v-else-if="props.day.isHoliday" class="holiday-name">{{ props.day.holidayName }}</div>
          <div v-else class="hours-placeholder"></div>
        </div>
        <div class="day-card-face back" :class="flippedType">
          <!-- ... (back face remains unchanged) ... -->
        </div>
      </div>
    </div>
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

const props = defineProps(['day'])
const emit = defineEmits(['update:type', 'update:hours'])

const showHoursSelector = ref(false)
const isFlipped = ref(false)
const currentType = ref(props.day.workType || 'home')
const longPressTimer = ref(null)
const longPressDuration = 500 // ms
const isLongPress = ref(false)

const showHours = computed(() => currentType.value === 'office' || currentType.value === 'sick-vacation')
const isEditable = computed(() => currentType.value === 'office')

const weekdayAbbreviation = computed(() => {
  const date = new Date(props.day.date)
  return date.toLocaleString('en-US', { weekday: 'short' })
})

const formattedDate = computed(() => {
  const date = new Date(props.day.date)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
})

const flippedType = computed(() => {
  if (currentType.value === 'home') return 'office'
  if (currentType.value === 'office') return 'home'
  if (currentType.value === 'sick-vacation') return 'home'
  return 'office'
})

function workTypeWithEmoji(type) {
  if (type === 'holiday') return '🎉 Holiday'
  if (type === 'sick-vacation') return '🤒 Sick/Vacation'
  return type === 'home' ? '🏠 Home' : '🏢 Office'
}

function flipCard(newType) {
  if (props.day.isHoliday) return
  isFlipped.value = true
  
  setTimeout(() => {
    currentType.value = newType
    emit('update:type', currentType.value)
    if (currentType.value === 'sick-vacation') {
      emit('update:hours', 8)
    }
    isFlipped.value = false
  }, 150)
}

function toggleHoursSelector(event) {
  if (!isEditable.value) return
  event.stopPropagation()
  showHoursSelector.value = !showHoursSelector.value
}

function updateHours(newHours) {
  if (!isEditable.value) return
  emit('update:hours', newHours)
}

function formatHours(hours) {
  const wholeHours = Math.floor(hours)
  const minutes = (hours % 1) * 60
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function startLongPress(event) {
  if (props.day.isHoliday) return
  event.preventDefault()
  isLongPress.value = false
  longPressTimer.value = setTimeout(() => {
    isLongPress.value = true
    const newType = currentType.value === 'sick-vacation' ? 'home' : 'sick-vacation'
    flipCard(newType)
  }, longPressDuration)
}

function handleMouseUp(event) {
  if (props.day.isHoliday) return
  
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
    
    if (!isLongPress.value) {
      // This was a short press, so flip the card
      const newType = currentType.value === 'home' ? 'office' : 'home'
      flipCard(newType)
    }
  }
  
  isLongPress.value = false
}

function handleTouchEnd(event) {
  event.preventDefault()
  if (props.day.isHoliday) return
  
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
    
    if (!isLongPress.value) {
      // This was a short press, so flip the card
      const newType = currentType.value === 'home' ? 'office' : 'home'
      flipCard(newType)
    }
  }
  
  isLongPress.value = false
}

function cancelLongPress() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  isLongPress.value = false
}

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
  width: 25%;
}

.work-type {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  font-weight: bold;
}

.hours, .hours-placeholder, .holiday-name {
  width: 25%;
  text-align: right;
  font-size: 0.8em;
}

.weekday {
  font-size: 0.9em;
  font-weight: bold;
}

.date {
  font-size: 0.8em;
  color: #666;
}

.hours {
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
}

.is-holiday {
  opacity: 0.7;
  pointer-events: none;
}

.holiday-name {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.day-card:not(.is-holiday) {
  cursor: pointer;
}

.day-card:not(.is-holiday) .hours {
  cursor: pointer;
}

.day-card-face.sick-vacation {
  background-color: #ffebee;
}

.is-sick-vacation {
  opacity: 0.9;
}

.hours.non-editable {
  color: #999;
  cursor: default;
}
</style>