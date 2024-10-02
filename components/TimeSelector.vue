<template>
  <div class="time-selector-overlay">
    <div class="time-selector-content">
      <h2>{{ formattedDate }}</h2>
      <div class="time-picker">
        <div class="time-column">
          <div class="scroll-container" ref="hoursContainer" @wheel="handleWheel('hours', $event)">
            <div 
              v-for="h in 24" 
              :key="`hour-${h-1}`" 
              class="time-item" 
              :class="{ 'selected': h - 1 === hours }"
              @click="setHours(h - 1)"
            >
              {{ String(h - 1).padStart(2, '0') }}
            </div>
          </div>
        </div>
        <div class="time-separator">:</div>
        <div class="time-column">
          <div class="scroll-container" ref="minutesContainer" @wheel="handleWheel('minutes', $event)">
            <div 
              v-for="m in 60" 
              :key="`minute-${m-1}`" 
              class="time-item" 
              :class="{ 'selected': m - 1 === minutes }"
              @click="setMinutes(m - 1)"
            >
              {{ String(m - 1).padStart(2, '0') }}
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button @click="confirm">Confirm</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  initialMinutes: {
    type: Number,
    default: 480
  },
  date: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:time', 'close']);

const hours = ref(Math.floor(props.initialMinutes / 60));
const minutes = ref(props.initialMinutes % 60);
const hoursContainer = ref(null);
const minutesContainer = ref(null);

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

function setHours(newHours) {
  hours.value = newHours;
  scrollToSelected(hoursContainer.value, newHours);
}

function setMinutes(newMinutes) {
  minutes.value = newMinutes;
  scrollToSelected(minutesContainer.value, newMinutes);
}

function handleWheel(type, event) {
  event.preventDefault();
  const delta = Math.sign(event.deltaY);
  if (type === 'hours') {
    setHours((hours.value + delta + 24) % 24);
  } else {
    setMinutes((minutes.value + delta + 60) % 60);
  }
}

function scrollToSelected(container, index) {
  if (container) {
    const itemHeight = container.children[0].offsetHeight;
    container.scrollTop = index * itemHeight - container.offsetHeight / 2 + itemHeight / 2;
  }
}

function confirm() {
  emit('update:time', hours.value * 60 + minutes.value);
  emit('close');
}

function cancel() {
  emit('close');
}

onMounted(() => {
  nextTick(() => {
    scrollToSelected(hoursContainer.value, hours.value);
    scrollToSelected(minutesContainer.value, minutes.value);
  });
});
</script>

<style scoped>
.time-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.time-selector-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.time-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.time-column {
  width: 60px;
  height: 180px;
  overflow: hidden;
}

.scroll-container {
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.time-item {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  scroll-snap-align: center;
  cursor: pointer;
}

.time-item.selected {
  background-color: #e0e0e0;
  font-weight: bold;
}

.time-separator {
  font-size: 36px;
  margin: 0 10px;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:first-child {
  background-color: #4CAF50;
  color: white;
}

.buttons button:last-child {
  background-color: #f44336;
  color: white;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scroll-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scroll-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>