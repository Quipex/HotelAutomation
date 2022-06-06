import moment, { MomentInput } from 'moment';

function daysBetween(date1: MomentInput, date2: MomentInput): number {
  return Math.abs(moment(date1).diff(moment(date2), 'days'));
}

export { daysBetween };
