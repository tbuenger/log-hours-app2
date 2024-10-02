<template>
  <div class="progress-bar-container">
    <div 
      class="progress-bar" 
      :style="{ width: `${percentage}%`, backgroundColor: progressBarColor }"
    ></div>
    <span class="progress-text">{{ percentage.toFixed(1) }}%</span>
    <span class="remaining-time" v-if="remainingTime > 0">
      {{ formatRemainingTimeShort(remainingTime) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: Number,
  remainingTime: Number
})

const progressBarColor = computed(() => props.percentage >= 40 ? '#4CAF50' : '#FF9800')

function formatRemainingTimeShort(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}
</script>

<style scoped>
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.progress-text, .remaining-time {
  position: relative;
  z-index: 1;
  font-weight: bold;
  color: #333;
}
</style>