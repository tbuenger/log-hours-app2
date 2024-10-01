export const berlinHolidays = [
  // 2023 holidays
  { date: '2023-01-01', name: 'New Year\'s Day' },
  { date: '2023-04-07', name: 'Good Friday' },
  { date: '2023-04-09', name: 'Easter Sunday' },
  { date: '2023-04-10', name: 'Easter Monday' },
  { date: '2023-05-01', name: 'Labour Day' },
  { date: '2023-05-18', name: 'Ascension Day' },
  { date: '2023-05-28', name: 'Whit Sunday' },
  { date: '2023-05-29', name: 'Whit Monday' },
  { date: '2023-10-03', name: 'German Unity Day' },
  { date: '2023-12-25', name: 'Christmas Day' },
  { date: '2023-12-26', name: 'Boxing Day' },

  // 2024 holidays
  { date: '2024-01-01', name: 'New Year\'s Day' },
  { date: '2024-03-29', name: 'Good Friday' },
  { date: '2024-03-31', name: 'Easter Sunday' },
  { date: '2024-04-01', name: 'Easter Monday' },
  { date: '2024-05-01', name: 'Labour Day' },
  { date: '2024-05-09', name: 'Ascension Day' },
  { date: '2024-05-19', name: 'Whit Sunday' },
  { date: '2024-05-20', name: 'Whit Monday' },
  { date: '2024-10-03', name: 'German Unity Day' },
  { date: '2024-12-25', name: 'Christmas Day' },
  { date: '2024-12-26', name: 'Boxing Day' },

  // 2025 holidays
  { date: '2025-01-01', name: 'New Year\'s Day' },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-04-20', name: 'Easter Sunday' },
  { date: '2025-04-21', name: 'Easter Monday' },
  { date: '2025-05-01', name: 'Labour Day' },
  { date: '2025-05-29', name: 'Ascension Day' },
  { date: '2025-06-08', name: 'Whit Sunday' },
  { date: '2025-06-09', name: 'Whit Monday' },
  { date: '2025-10-03', name: 'German Unity Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
  { date: '2025-12-26', name: 'Boxing Day' },

  // 2026 holidays
  { date: '2026-01-01', name: 'New Year\'s Day' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-05', name: 'Easter Sunday' },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-05-14', name: 'Ascension Day' },
  { date: '2026-05-24', name: 'Whit Sunday' },
  { date: '2026-05-25', name: 'Whit Monday' },
  { date: '2026-10-03', name: 'German Unity Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' }
];

export function isHoliday(date) {
  return berlinHolidays.some(holiday => holiday.date === date);
}

export function getHolidayName(date) {
  const holiday = berlinHolidays.find(holiday => holiday.date === date);
  return holiday ? holiday.name : null;
}