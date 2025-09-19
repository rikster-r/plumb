export const parseDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return null;
  const [datePart, timePart] = dateTimeString.split(' ');
  const [day, month, year] = datePart.split('.');
  return new Date(`${year}-${month}-${day}T${timePart}:00`);
};

export const formatDateTime = (dateTimeString: string) => {
  const date = parseDateTime(dateTimeString);
  if (!date) return { date: '', time: '' };

  return {
    date: date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};