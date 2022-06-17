import dayjs, { ConfigType } from 'dayjs';
import { UnitOfTime } from '~/types';

function unitsBetween(date1: ConfigType, date2: ConfigType, unit: UnitOfTime): number {
  return Math.abs(dayjs(date1).diff(date2, unit));
}

export { unitsBetween };
