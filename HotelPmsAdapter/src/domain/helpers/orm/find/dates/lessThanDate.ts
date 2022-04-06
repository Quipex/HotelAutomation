import { formatDate } from '~/common/utils/dates';
import { Raw } from 'typeorm';

const lessThanDate = (date: Date) => {
  return Raw((alias) => `${alias} < :date`, { date: formatDate(date) });
};

export { lessThanDate };
