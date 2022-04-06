import { formatDate } from '~/common/utils/dates';
import { Raw } from 'typeorm';

const moreThanDate = (date: Date) => {
  return Raw((alias) => `${alias} > :date`, { date: formatDate(date) });
};

export { moreThanDate };
