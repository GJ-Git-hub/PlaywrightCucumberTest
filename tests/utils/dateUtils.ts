import { format, addDays, isBefore, parseISO } from 'date-fns';

export function getFutureDate(daysFromToday: number): Date {
  return addDays(new Date(), daysFromToday);
}

export function formatDate(date: Date, pattern = 'dd MMM yyyy'): string {
  return format(date, pattern);
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function isPastDate(dateStr: string): boolean {
  const date = parseISO(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(date, today);
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthIndex];
}
