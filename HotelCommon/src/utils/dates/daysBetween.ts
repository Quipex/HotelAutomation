import dayjs, { ConfigType } from 'dayjs';

function daysBetween(date1: ConfigType, date2: ConfigType): number {
  return Math.abs(dayjs(date1).diff(dayjs(date2), 'days'));
}

export { daysBetween };
