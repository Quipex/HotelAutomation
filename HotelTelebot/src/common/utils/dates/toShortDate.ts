import moment from 'moment';

function toShortDate(date: MomentInput): string {
  return moment(date).format('DD.MM');
}

export { toShortDate };
