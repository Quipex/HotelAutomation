import dayjs, { ConfigType } from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { DATE_GENERAL } from '~/constants/dates';

function formatDate(date: ConfigType, format?: string): string {
  dayjs.extend(localizedFormat);
  return dayjs(date).locale('ru').format(format ?? DATE_GENERAL);
}

export { formatDate };
