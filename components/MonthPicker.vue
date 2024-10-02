<template>
  <div class="month-picker">
    <button @click="$emit('change-month', -1)">Previous</button>
    <span>{{ currentMonthYear }}</span>
    <button @click="$emit('change-month', 1)">Next</button>
  </div>
</template>

<script setup>
defineProps(['currentMonthYear'])
defineEmits(['change-month'])
</script>

<style scoped>
.month-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.month-picker button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.month-picker button:hover {
  background-color: #2980b9;
}

.month-picker span {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}
</style>