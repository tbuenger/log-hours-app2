<template>
  <div class="day-card-container">
    <div 
      class="day-card" 
      :class="{ 'is-flipped': isFlipped, 'is-holiday': props.day.isHoliday, 'is-sick-vacation': currentType === 'sick-vacation' }" 
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
      @touchstart.passive="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
    >
      <div class="day-card-inner">
        <div class="day-card-face front" :class="currentType">
          <div class="day-info">
            <div class="weekday text-sm">{{ weekdayAbbreviation }}</div>
            <div class="date text-xs">{{ formattedDate }}</div>
          </div>
          <div class="work-type text-sm truncate">{{ workTypeWithEmoji(currentType) }}</div>
          <div 
            v-if="showHours" 
            class="hours text-sm" 
            :class="{ 'non-editable': !isEditable }" 
            @click.stop="openTimeSelector"
            @mousedown.stop
            @touchstart.stop="handleHoursTouchStart"
            @touchend.stop="handleHoursTouchEnd"
          >
            {{ formatHours(props.day.minutes) }}
          </div>
          <div v-else-if="props.day.isHoliday" class="holiday-name text-xs truncate">{{ props.day.holidayName }}</div>
          <div v-else class="hours-placeholder"></div>
        </div>
        <div class="day-card-face back" :class="flippedType">
          <!-- ... (back face remains unchanged) ... -->
        </div>
      </div>
    </div>
    <TimeSelector 
      v-if="showTimeSelector" 
      :initialMinutes="props.day.minutes"
      :date="props.day.date"
      @update:time="updateHours" 
      @close="closeTimeSelector"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TimeSelector from './TimeSelector.vue'

const props = defineProps(['day'])
const emit = defineEmits(['update:type', 'update:hours'])

const showTimeSelector = ref(false)
const isFlipped = ref(false)
const currentType = ref(props.day.workType || 'home')
const longPressTimer = ref(null)
const longPressDuration = 500 // ms
const touchStartTime = ref(0)
const touchStartY = ref(0)
const touchStartX = ref(0)

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
      emit('update:hours', 480) // 8 hours = 480 minutes
    }
    isFlipped.value = false
  }, 150)
}

function openTimeSelector(event) {
  event.stopPropagation()
  event.preventDefault()
  if (isEditable.value) {
    showTimeSelector.value = true
    clearTimeout(longPressTimer.value)
  }
}

function handleHoursTouchStart(event) {
  event.stopPropagation()
  touchStartTime.value = Date.now()
}

function handleHoursTouchEnd(event) {
  event.stopPropagation()
  event.preventDefault()
  const touchDuration = Date.now() - touchStartTime.value
  if (touchDuration < 300) {
    openTimeSelector(event)
  }
}

const handleInteraction = (event, interactionType) => {
  if (props.day.isHoliday || showTimeSelector.value) return

  if (interactionType === 'tap') {
    if (event.target.classList.contains('hours')) {
      openTimeSelector(event)
    } else {
      const newType = currentType.value === 'home' ? 'office' : 'home'
      flipCard(newType)
    }
  } else if (interactionType === 'longPress') {
    const newType = currentType.value === 'sick-vacation' ? 'home' : 'sick-vacation'
    flipCard(newType)
  }
}

const clearLongPressTimer = () => {
  if (longPressTimer.value) {
    window.clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

function handleTouchStart(event) {
  if (props.day.isHoliday || showTimeSelector.value) return
  touchStartTime.value = Date.now()
  touchStartY.value = event.touches[0].clientY
  touchStartX.value = event.touches[0].clientX
  
  longPressTimer.value = window.setTimeout(() => handleInteraction(event, 'longPress'), longPressDuration)
}

function handleTouchEnd(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
  const touchEndY = event.changedTouches[0].clientY
  const touchEndX = event.changedTouches[0].clientX
  const touchDuration = Date.now() - touchStartTime.value
  const verticalDistance = Math.abs(touchEndY - touchStartY.value)
  const horizontalDistance = Math.abs(touchEndX - touchStartX.value)

  clearLongPressTimer()

  if (touchDuration < 300 && verticalDistance < 10 && horizontalDistance < 10) {
    handleInteraction(event, 'tap')
  }
}

function handleMouseDown(event) {
  if (props.day.isHoliday || showTimeSelector.value) return
  if (!event.target.classList.contains('hours')) {
    longPressTimer.value = window.setTimeout(() => handleInteraction(event, 'longPress'), longPressDuration)
  }
}

function handleMouseUp(event) {
  clearLongPressTimer()
  handleInteraction(event, 'tap')
}

const handleMouseLeave = clearLongPressTimer
const handleTouchCancel = clearLongPressTimer

watch(() => props.day.workType, (newType) => {
  currentType.value = newType
})

onMounted(() => {
  currentType.value = props.day.workType || 'home'
})

function formatHours(minutes) {
  if (currentType.value === 'sick-vacation') {
    return '08:00' // Always display 8 hours for sick/vacation days
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

function updateHours(newMinutes) {
  if (isEditable.value) {
    emit('update:hours', newMinutes)
    closeTimeSelector()
  }
}

function closeTimeSelector() {
  showTimeSelector.value = false
}
</script>

<style scoped>
.day-card-container {
  width: calc(100% - 10px);
  margin: 0 0 12px;
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
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid var(--card-border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  font-weight: 500;
}

.hours, .hours-placeholder, .holiday-name {
  width: 25%;
  text-align: right;
}

.weekday {
  font-weight: 600;
}

.date {
  color: #555;
}

.hours {
  font-weight: 500;
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