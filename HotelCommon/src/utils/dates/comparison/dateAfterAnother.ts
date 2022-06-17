import dayjs, { ConfigType } from 'dayjs';
import { UnitOfTime } from '~/types';

const dateAfterAnother = (date1: ConfigType, date2: ConfigType, unit?: UnitOfTime): boolean => {
  return dayjs(date1).isAfter(date2, unit);
};

export { dateAfterAnother };
