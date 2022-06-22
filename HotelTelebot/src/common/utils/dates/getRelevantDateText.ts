import { addToDate, formatDate, subtractFromDate } from '~/common/utils/dates';
import { DATE_SHORT } from '~/common/constants';

const getRelevantDateText = (date: Date): string => {
  const now = new Date();
  const shortDate = formatDate(date, DATE_SHORT);
  const isToday = formatDate(date) === formatDate(now);
  if (isToday) {
    return `Сегодня (${shortDate})`;
  }
  const isTomorrow = formatDate(now) === formatDate(subtractFromDate({ date, unit: 'days', amount: 1 }));
  if (isTomorrow) {
    return `Завтра (${shortDate})`;
  }
  const isYesterday = formatDate(now) === formatDate(addToDate({ date, unit: 'days', amount: 1 }));
  if (isYesterday) {
    return `Вчера (${shortDate})`;
  }
  return `Дата ${shortDate}`;
};

export { getRelevantDateText };
