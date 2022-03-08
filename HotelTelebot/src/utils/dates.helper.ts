import moment, { Moment, MomentInputObject } from 'moment';

type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | null | undefined;

function toShortDate(date: MomentInput): string {
  return moment(date).format('DD.MM');
}

function daysBetween(date1: MomentInput, date2: MomentInput): number {
  return Math.abs(moment(date1).diff(moment(date2), 'days'));
}

function toUnixDate(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

