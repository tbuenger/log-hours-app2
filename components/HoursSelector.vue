<template>
  <div class="hours-selector-overlay" @click.self="close">
    <div class="hours-selector">
      <h3>Select Hours</h3>
      <div class="slider-container">
        <input 
          type="range" 
          min="0" 
          max="24" 
          step="0.5" 
          v-model="selectedHours" 
          @input="updateHours"
        >
        <div class="current-value">{{ formatHour(selectedHours) }}</div>
      </div>
      <div class="buttons">
        <button @click="close">Cancel</button>
        <button @click="confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

/**
 * HoursSelector Component
 * 
 * This component provides a slider interface for selecting work hours.
 * It allows users to choose hours in 0.5 hour increments from 0 to 24 hours.
 */

const props = defineProps(['hours']);
const emit = defineEmits(['update:hours', 'close']);

// Reactive reference to store the currently selected hours
const selectedHours = ref(props.hours);

/**
 * Formats the hour value for display.
 * 
 * @param {number} hour - The hour value to format
 * @returns {string} Formatted hour string (e.g., "08:30")
 */
const formatHour = (hour) => {
  const wholeHours = Math.floor(hour);
  const minutes = (hour % 1) * 60;
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Updates the hours value and emits the change to the parent component.
 */
const updateHours = () => {
  emit('update:hours', parseFloat(selectedHours.value));
};

/**
 * Closes the hours selector without saving changes.
 */
const close = () => {
  emit('close');
};

/**
 * Confirms the selected hours, updates the value, and closes the selector.
 */
const confirm = () => {
  updateHours();
  close();
};

// Initialize the selectedHours value when the component is mounted
onMounted(() => {
  selectedHours.value = props.hours;
});
</script>

<style scoped>
.hours-selector-overlay {
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

.hours-selector {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 300px;
}

h3 {
  margin-top: 0;
  text-align: center;
}

.slider-container {
  margin: 20px 0;
}

input[type="range"] {
  width: 100%;
  margin-bottom: 10px;
}

.current-value {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007AFF;
  color: white;
  font-size: 1em;
  cursor: pointer;
}

button:first-child {
  background-color: #888;
}
</style>