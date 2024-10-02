<template>
  <div class="time-selector-overlay">
    <div class="time-selector-content">
      <h2>{{ formattedDate }}</h2>
      <div class="time-picker">
        <div class="time-column">
          <button @click="incrementHours">▲</button>
          <span>{{ String(hours).padStart(2, '0') }}</span>
          <button @click="decrementHours">▼</button>
        </div>
        <div class="time-separator">:</div>
        <div class="time-column">
          <button @click="incrementMinutes">▲</button>
          <span>{{ String(minutes).padStart(2, '0') }}</span>
          <button @click="decrementMinutes">▼</button>
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
import { ref, computed } from 'vue';

const props = defineProps({
  initialHours: {
    type: Number,
    default: 8
  },
  initialMinutes: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:time', 'close']);

const hours = ref(props.initialHours);
const minutes = ref(props.initialMinutes);

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

function incrementHours() {
  hours.value = (hours.value + 1) % 24;
}

function decrementHours() {
  hours.value = (hours.value - 1 + 24) % 24;
}

function incrementMinutes() {
  minutes.value = (minutes.value + 1) % 60;
}

function decrementMinutes() {
  minutes.value = (minutes.value - 1 + 60) % 60;
}

function confirm() {
  emit('update:time', hours.value + minutes.value / 60);
  emit('close');
}

function cancel() {
  emit('close');
}
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-column button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.time-column span {
  font-size: 36px;
  margin: 10px 0;
}

.time-separator {
  font-size: 36px;
  margin: 0 10px;
}

.buttons {
  display: flex;
  justify-content: space-around;
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
</style>