<template>
    <div>
      <input 
        type="range" 
        :value="hours" 
        min="0" 
        max="12" 
        @input="handleInput" 
      />
      <span>{{ hours }} hours</span>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['hours'])
  const emit = defineEmits(['update:hours'])
  
  function handleInput(event) {
    emit('update:hours', Number(event.target.value))
  }
  </script>