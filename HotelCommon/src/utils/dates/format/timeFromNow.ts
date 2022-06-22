import dayjs, { ConfigType } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DAYJS_LOCALE } from '~/constants';

function timeFromNow(date: ConfigType) {
  dayjs.extend(relativeTime);
  return dayjs(date).locale(DAYJS_LOCALE).fromNow();
}

export { timeFromNow };
