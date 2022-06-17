import dayjs, { ConfigType } from 'dayjs';
import { UnitOfTime } from '~/types';

const dateBeforeAnother = (date1: ConfigType, date2: ConfigType, unit?: UnitOfTime): boolean => {
  return dayjs(date1).isBefore(date2, unit);
};

export { dateBeforeAnother };
