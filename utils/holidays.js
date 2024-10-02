const berlinHolidaysMap = new Map([
  ['2023-01-01', 'New Year\'s Day'],
  ['2023-04-07', 'Good Friday'],
  // ... add all holidays here ...
]);

export function isHoliday(date) {
  return berlinHolidaysMap.has(date);
}

export function getHolidayName(date) {
  return berlinHolidaysMap.get(date) || null;
}