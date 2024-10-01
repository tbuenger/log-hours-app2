<template>
    <select :value="type" @change="handleChange">
      <option value="home">🏠 Home</option>
      <option value="office">🏢 Office</option>
      <option value="sick">🤒 Sick</option>
      <option value="vacation">🌴 Vacation</option>
    </select>
  </template>
  
  <script setup>
  const props = defineProps(['type'])
  const emit = defineEmits(['update:type'])
  
  function handleChange(event) {
    emit('update:type', event.target.value)
  }
  </script>