import { differenceInHours, format, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDueDate = (date: string | null): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d');
};

export const isDueSoon = (date: string | null): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return differenceInHours(d, new Date()) <= 48 && !isPast(d);
};

export const isOverdue = (date: string | null): boolean => {
  if (!date) return false;
  return isPast(new Date(date));
};

export const formatDateTime = (date: string | null): string => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd HH:mm');
};
