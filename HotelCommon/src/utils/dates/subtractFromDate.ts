import moment from 'moment';
import { UnitOfTime } from '~/types';

type Args = {
  amount: number,
  unit: UnitOfTime
  date?: Date;
};

const subtractFromDate = ({ date, amount, unit }: Args) => {
  return moment(date).subtract(amount, unit);
};

export { subtractFromDate };
