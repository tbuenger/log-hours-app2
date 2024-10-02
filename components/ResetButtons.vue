<template>
  <div class="reset-buttons">
    <button @click="$emit('clear-current-month')">Clear Current Month</button>
    <button @click="$emit('clear-all-data')">Clear All Data</button>
  </div>
</template>

<script setup>
defineEmits(['clear-current-month', 'clear-all-data'])
</script>

<style scoped>
.reset-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.reset-buttons button {
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-buttons button:hover {
  background-color: #c0392b;
}
</style>