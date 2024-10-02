<template>
  <div class="month-picker">
    <button @click="$emit('change-month', -1)" class="icon-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    </button>
    <span>{{ currentMonthYear }}</span>
    <button @click="$emit('change-month', 1)" class="icon-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>
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
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icon-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 50%;
}

.icon-button:hover {
  background-color: #f0f0f0;
}

.icon-button:active {
  background-color: #e0e0e0;
}

span {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}
</style>