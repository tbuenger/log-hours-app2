<template>
  <div class="hours-selector" @click.stop>
    <div class="selector-content">
      <div class="selector-wheel" 
           ref="wheelRef" 
           @touchstart="startDrag" 
           @touchmove="drag" 
           @touchend="endDrag"
           @mousedown="startDrag"
           @mousemove="drag"
           @mouseup="endDrag"
           @mouseleave="endDrag">
        <div 
          v-for="hour in displayedHours" 
          :key="hour" 
          class="hour-option"
          :class="{ active: hour === selectedHours }"
        >
          {{ formatHour(hour) }}
        </div>
      </div>
      <div class="selector-highlight"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps(['hours'])
const emit = defineEmits(['update:hours', 'close'])

const selectedHours = ref(props.hours)
const wheelRef = ref(null)
const scrollTop = ref(0)
const itemHeight = 40 // Height of each hour option in pixels

const hourOptions = computed(() => {
  return Array.from({ length: 25 }, (_, i) => i / 2).filter(h => h > 0)
})

const displayedHours = computed(() => {
  return [...hourOptions.value.slice(-3), ...hourOptions.value, ...hourOptions.value.slice(0, 3)]
})

const startY = ref(0)
const startScrollTop = ref(0)
const isDragging = ref(false)

function startDrag(event) {
  isDragging.value = true
  startY.value = event.touches ? event.touches[0].clientY : event.clientY
  startScrollTop.value = scrollTop.value
}

function drag(event) {
  if (!isDragging.value) return
  const currentY = event.touches ? event.touches[0].clientY : event.clientY
  const deltaY = currentY - startY.value
  scrollTop.value = startScrollTop.value - deltaY
  updateSelectedHour()
}

function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  const nearestHourIndex = Math.round(scrollTop.value / itemHeight)
  scrollTop.value = nearestHourIndex * itemHeight
  updateSelectedHour()
}

function updateSelectedHour() {
  const index = Math.round(scrollTop.value / itemHeight) % hourOptions.value.length
  selectedHours.value = hourOptions.value[index]
  emit('update:hours', selectedHours.value)
}

function formatHour(hour) {
  const wholeHours = Math.floor(hour)
  const minutes = (hour % 1) * 60
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

onMounted(() => {
  const initialIndex = hourOptions.value.indexOf(selectedHours.value)
  scrollTop.value = (initialIndex + 3) * itemHeight // +3 to account for extra options at the beginning
})

watch(scrollTop, () => {
  if (wheelRef.value) {
    wheelRef.value.style.transform = `translateY(${-scrollTop.value}px)`
  }
})
</script>

<style scoped>
.hours-selector {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
}

.selector-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  height: 120px;
  overflow: hidden;
  position: relative;
}

.selector-wheel {
  transition: transform 0.1s;
  cursor: grab;
}

.selector-wheel:active {
  cursor: grabbing;
}

.hour-option {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 1.2em;
  color: #999;
}

.selector-highlight {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 40px;
  transform: translateY(-50%);
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  pointer-events: none;
}

.hour-option.active {
  font-weight: bold;
  color: #000;
}
</style>