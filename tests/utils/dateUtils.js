const { format, addDays, isBefore, parseISO } = require('date-fns');

function getFutureDate(daysFromToday) {
  return addDays(new Date(), daysFromToday);
}

function formatDate(date, pattern = 'dd MMM yyyy') {
  return format(date, pattern);
}

function formatDateISO(date) {
  return format(date, 'yyyy-MM-dd');
}

function isPastDate(dateStr) {
  const date = parseISO(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(date, today);
}

function getMonthName(monthIndex) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthIndex];
}

module.exports = { getFutureDate, formatDate, formatDateISO, isPastDate, getMonthName };
