import dayjs from 'dayjs';
import { UnitOfTime } from '~/types';

type Args = {
  amount: number,
  unit: UnitOfTime
  date?: Date;
};

const addToDate = ({ date, amount, unit }: Args) => {
  return dayjs(date).add(amount, unit);
};

export { addToDate };
