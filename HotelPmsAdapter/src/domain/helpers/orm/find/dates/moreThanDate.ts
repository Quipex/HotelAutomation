import { Raw } from 'typeorm';
import { formatDate } from '~/common/utils/dates';

const moreThanDate = (date: Date) => {
  return Raw((alias) => `${alias} > :date`, { date: formatDate(date) });
};

export { moreThanDate };
