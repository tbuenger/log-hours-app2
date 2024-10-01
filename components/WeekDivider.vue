<template>
  <div class="week-divider">
    <div class="line"></div>
    <div class="week-number">Week {{ weekNumber }}</div>
    <div class="line"></div>
  </div>
</template>

<script setup>
defineProps({
  weekNumber: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.week-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  opacity: 0.5;
}

.line {
  flex-grow: 1;
  height: 1px;
  background-color: var(--text-color);
}

.week-number {
  padding: 0 10px;
  font-size: 0.9em;
  color: var(--text-color);
}
</style>