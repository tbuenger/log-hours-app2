import { ref, computed } from 'vue'
import { isHoliday, getHolidayName } from '~/utils/holidays'

export function useWorkSchedule() {
  const currentDate = ref(new Date())
  const daysAndDividers = ref([])

  const getStoredData = (date) => {
    const storedData = localStorage.getItem(date)
    return storedData ? JSON.parse(storedData) : { type: 'home', minutes: 480 }
  }

  const storeData = (date, data) => {
    localStorage.setItem(date, JSON.stringify(data))
  }

  const updateDaysAndDividers = () => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const daysInMonthCount = new Date(year, month + 1, 0).getDate()
    
    const items = []
    let currentWeek = null
    let firstWorkdayFound = false

    for (let i = 1; i <= daysInMonthCount; i++) {
      const date = new Date(year, month, i)
      const dayOfWeek = date.getDay()
      const weekNumber = getWeekNumber(date)

      if (dayOfWeek >= 1 && dayOfWeek <= 5 || isHoliday(date.toISOString().split('T')[0])) {
        if (weekNumber !== currentWeek && firstWorkdayFound) {
          items.push({ type: 'divider', weekNumber })
        }
        
        if (!firstWorkdayFound) {
          firstWorkdayFound = true
          items.push({ type: 'divider', weekNumber })
        }

        currentWeek = weekNumber

        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        const dateString = date.toISOString().split('T')[0]
        const storedData = getStoredData(dateString)
        const holidayName = getHolidayName(dateString)

        items.push({
          type: 'day',
          date: dateString,
          workType: holidayName ? 'holiday' : storedData.type,
          minutes: holidayName ? 480 : storedData.minutes,
          isHoliday: !!holidayName,
          holidayName: holidayName
        })
      }
    }

    daysAndDividers.value = items
  }

  const officePercentage = computed(() => {
    const workingDays = daysAndDividers.value.filter(item => 
      item.type === 'day' && !item.isHoliday
    )
    const totalWorkMinutes = workingDays.length * 480
    const officeMinutes = workingDays.reduce((sum, day) => {
      if (day.workType === 'office') {
        return sum + day.minutes
      } else if (day.workType === 'sick-vacation') {
        return sum + 480
      }
      return sum
    }, 0)
    return totalWorkMinutes > 0 ? (officeMinutes / totalWorkMinutes) * 100 : 0
  })

  const remainingTime = computed(() => {
    if (officePercentage.value >= 40) return 0
    const workingDays = daysAndDividers.value.filter(item => 
      item.type === 'day' && !item.isHoliday
    )
    const totalWorkMinutes = workingDays.length * 480
    const currentOfficeMinutes = workingDays.reduce((sum, day) => {
      if (day.workType === 'office') {
        return sum + day.minutes
      } else if (day.workType === 'sick-vacation') {
        return sum + 480
      }
      return sum
    }, 0)
    const requiredOfficeMinutes = totalWorkMinutes * 0.4
    return Math.max(0, Math.ceil(requiredOfficeMinutes - currentOfficeMinutes))
  })

  const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
  })

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + delta)
    currentDate.value = newDate
    updateDaysAndDividers()
  }

  const updateDayType = (date, newType) => {
    const dayIndex = daysAndDividers.value.findIndex(item => item.type === 'day' && item.date === date)
    if (dayIndex !== -1) {
      daysAndDividers.value[dayIndex].workType = newType
      if (newType === 'sick-vacation') {
        daysAndDividers.value[dayIndex].minutes = 480
      }
      storeData(date, { type: newType, minutes: daysAndDividers.value[dayIndex].minutes })
    }
  }

  const updateDayHours = (date, newMinutes) => {
    const dayIndex = daysAndDividers.value.findIndex(item => item.type === 'day' && item.date === date)
    if (dayIndex !== -1) {
      daysAndDividers.value[dayIndex].minutes = newMinutes
      storeData(date, { type: daysAndDividers.value[dayIndex].workType, minutes: newMinutes })
    }
  }

  const clearCurrentMonth = () => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const daysInMonthCount = new Date(year, month + 1, 0).getDate()

    for (let i = 1; i <= daysInMonthCount; i++) {
      const date = new Date(year, month, i)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      const dateString = date.toISOString().split('T')[0]
      localStorage.removeItem(dateString)
    }
    updateDaysAndDividers()
  }

  const clearAllData = () => {
    localStorage.clear()
    updateDaysAndDividers()
  }

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  }

  return {
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
  }
}