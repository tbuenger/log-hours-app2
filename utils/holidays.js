const berlinHolidaysMap = new Map([
  // 2023 holidays
  ['2023-01-01', 'New Year\'s Day'],
  ['2023-04-07', 'Good Friday'],
  ['2023-04-09', 'Easter Sunday'],
  ['2023-04-10', 'Easter Monday'],
  ['2023-05-01', 'Labour Day'],
  ['2023-05-18', 'Ascension Day'],
  ['2023-05-28', 'Whit Sunday'],
  ['2023-05-29', 'Whit Monday'],
  ['2023-10-03', 'German Unity Day'],
  ['2023-12-25', 'Christmas Day'],
  ['2023-12-26', 'Boxing Day'],

  // 2024 holidays
  ['2024-01-01', 'New Year\'s Day'],
  ['2024-03-29', 'Good Friday'],
  ['2024-03-31', 'Easter Sunday'],
  ['2024-04-01', 'Easter Monday'],
  ['2024-05-01', 'Labour Day'],
  ['2024-05-09', 'Ascension Day'],
  ['2024-05-19', 'Whit Sunday'],
  ['2024-05-20', 'Whit Monday'],
  ['2024-10-03', 'German Unity Day'],
  ['2024-12-25', 'Christmas Day'],
  ['2024-12-26', 'Boxing Day'],

  // Add more years as needed
]);

export function isHoliday(date) {
  return berlinHolidaysMap.has(date);
}

export function getHolidayName(date) {
  return berlinHolidaysMap.get(date) || null;
}