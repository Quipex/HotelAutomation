import { ConfigType } from 'dayjs';
// noinspection ES6PreferShortImport
import { unitsBetween } from './unitsBetween';

const daysBetween = (date1: ConfigType, date2: ConfigType): number => {
  return unitsBetween(date1, date2, 'days');
};

export { daysBetween };
