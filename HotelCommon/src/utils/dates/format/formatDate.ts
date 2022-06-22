import dayjs, { ConfigType } from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { DATE_GENERAL, DAYJS_LOCALE } from '~/constants';

function formatDate(date: ConfigType, format?: string): string {
  dayjs.extend(localizedFormat);
  return dayjs(date).locale(DAYJS_LOCALE).format(format ?? DATE_GENERAL);
}

export { formatDate };
