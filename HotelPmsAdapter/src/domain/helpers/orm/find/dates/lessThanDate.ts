import { Raw } from 'typeorm';
import { formatDate } from '~/common/utils/dates';

const lessThanDate = (date: Date, format?: string) => {
  return Raw((alias) => `${alias} < :date`, { date: formatDate(date, format) });
};

export { lessThanDate };
