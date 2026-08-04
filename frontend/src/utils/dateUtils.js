import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date, formatStr = 'MMM D, YYYY') => {
  if (!date) return '';
  return dayjs(date).format(formatStr);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};
