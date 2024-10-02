<template>
  <div class="cards-container">
    <template v-for="(item, index) in daysAndDividers" :key="index">
      <WeekDivider v-if="item.type === 'divider'" :weekNumber="item.weekNumber" />
      <DayCard
        v-else
        :day="item"
        @update:type="$emit('update:type', item.date, $event)"
        @update:hours="$emit('update:hours', item.date, $event)"
      />
    </template>
  </div>
</template>

<script setup>
import WeekDivider from './WeekDivider.vue'
import DayCard from './DayCard.vue'

defineProps(['daysAndDividers'])
defineEmits(['update:type', 'update:hours'])
</script>

<style scoped>
.cards-container {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>