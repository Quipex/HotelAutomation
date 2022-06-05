import moment, { MomentInput } from 'moment';
import { DATE_GENERAL } from '~/constants/dates';

function formatDate(date: MomentInput, format?: string): string {
  return moment(date).format(format ?? DATE_GENERAL);
}

export { formatDate };
