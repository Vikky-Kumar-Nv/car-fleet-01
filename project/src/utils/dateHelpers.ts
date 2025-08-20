import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
};

export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'h:mm a');
};