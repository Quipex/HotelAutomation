import dayjs from 'dayjs';
import { UnitOfTime } from '~/types';

type Args = {
  amount: number,
  unit: UnitOfTime
  date?: Date;
};

const subtractFromDate = ({ date, amount, unit }: Args) => {
  return dayjs(date).subtract(amount, unit);
};

export { subtractFromDate };
