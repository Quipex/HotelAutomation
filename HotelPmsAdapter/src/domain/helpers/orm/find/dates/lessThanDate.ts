import { Raw } from 'typeorm';
import { formatDate } from '~/common/utils/dates';

const lessThanDate = (date: Date) => {
  return Raw((alias) => `${alias} < :date`, { date: formatDate(date) });
};

export { lessThanDate };
