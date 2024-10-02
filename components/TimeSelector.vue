<template>
  <div class="time-selector-overlay">
    <div class="time-selector-content">
      <h2>{{ formattedDate }}</h2>
      <div class="time-picker">
        <select v-model="selectedHours" class="time-dropdown">
          <option v-for="h in 24" :key="h-1" :value="h-1">
            {{ String(h-1).padStart(2, '0') }}
          </option>
        </select>
        <span class="time-separator">:</span>
        <select v-model="selectedMinutes" class="time-dropdown">
          <option v-for="m in 60" :key="m-1" :value="m-1">
            {{ String(m-1).padStart(2, '0') }}
          </option>
        </select>
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

const selectedHours = ref(Math.floor(props.initialMinutes / 60));
const selectedMinutes = ref(props.initialMinutes % 60);

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

function confirm() {
  emit('update:time', selectedHours.value * 60 + selectedMinutes.value);
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

.time-dropdown {
  font-size: 24px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
}

.time-separator {
  font-size: 24px;
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
  font-size: 16px;
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