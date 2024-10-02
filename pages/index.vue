<template>
  <div class="container">
    <ProgressBar 
      :percentage="officePercentage" 
      :remaining-time="remainingTime"
    />
    <div class="content">
      <MonthPicker 
        :current-month-year="currentMonthYear" 
        @change-month="changeMonth"
      />
      <DayCardList 
        :days-and-dividers="daysAndDividers" 
        @update:type="updateDayType" 
        @update:hours="updateDayHours"
      />
      <ResetButtons 
        @clear-current-month="clearCurrentMonth" 
        @clear-all-data="clearAllData"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useWorkSchedule } from '~/composables/useWorkSchedule'
import ProgressBar from '~/components/ProgressBar.vue'
import MonthPicker from '~/components/MonthPicker.vue'
import DayCardList from '~/components/DayCardList.vue'
import ResetButtons from '~/components/ResetButtons.vue'

const { 
  currentDate,
  daysAndDividers,
  officePercentage,
  remainingTime,
  currentMonthYear,
  changeMonth,
  updateDayType,
  updateDayHours,
  clearCurrentMonth,
  clearAllData,
  updateDaysAndDividers
} = useWorkSchedule()

onMounted(updateDaysAndDividers)
watch(currentDate, updateDaysAndDividers)
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 40px;
}

.content {
  padding: 10px;
}
</style>