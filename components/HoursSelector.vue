<template>
  <div class="hours-selector" @touchmove.prevent>
    <div class="scroll-wheel" ref="scrollWheel" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <div class="hour-option spacer"></div>
      <div 
        v-for="hour in hourOptions" 
        :key="hour" 
        class="hour-option"
        :class="{ 'selected': isSelected(hour) }"
      >
        {{ formatHour(hour) }}
      </div>
      <div class="hour-option spacer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps(['hours']);
const emit = defineEmits(['update:hours', 'close']);

const scrollWheel = ref(null);
const hourOptions = Array.from({ length: 48 }, (_, i) => i * 0.5);

const isSelected = (hour) => Math.abs(props.hours - hour) < 0.25;

const formatHour = (hour) => {
  const wholeHours = Math.floor(hour);
  const minutes = (hour % 1) * 60;
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

let startY = 0;
let startScrollTop = 0;

const touchStart = (e) => {
  startY = e.touches[0].clientY;
  startScrollTop = scrollWheel.value.scrollTop;
};

const touchMove = (e) => {
  const deltaY = startY - e.touches[0].clientY;
  scrollWheel.value.scrollTop = startScrollTop + deltaY;
};

const touchEnd = () => {
  const selectedIndex = Math.round(scrollWheel.value.scrollTop / 40);
  const selectedHour = hourOptions[selectedIndex];
  emit('update:hours', selectedHour);
  setTimeout(() => emit('close'), 300);
};

onMounted(() => {
  const selectedIndex = hourOptions.findIndex(hour => isSelected(hour));
  scrollWheel.value.scrollTop = selectedIndex * 40;
});

watch(() => props.hours, (newHours) => {
  const selectedIndex = hourOptions.findIndex(hour => isSelected(newHours));
  scrollWheel.value.scrollTop = selectedIndex * 40;
});
</script>

<style scoped>
.hours-selector {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 80px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.scroll-wheel {
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: y mandatory;
}

.hour-option {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  scroll-snap-align: center;
}

.hour-option.spacer {
  height: 40px;
}

.hour-option.selected {
  font-weight: bold;
  color: #007AFF;
}

/* Hide scrollbar */
.scroll-wheel::-webkit-scrollbar {
  display: none;
}
.scroll-wheel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>