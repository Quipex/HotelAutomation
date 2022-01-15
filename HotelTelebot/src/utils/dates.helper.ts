import moment, { Moment, MomentInputObject } from 'moment';

type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | null | undefined;

export function toShortDate(date: MomentInput): string {
  return moment(date).format('DD.MM');
}

export function daysBetween(date1: MomentInput, date2: MomentInput): number {
  return Math.abs(moment(date1).diff(moment(date2), 'days'));
}

export function toUnixDate(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * @return unix date from given string
 */
export function parseDate(dateText: string): Date | undefined {
  const dateTextLower = dateText.toLowerCase();
  const now = new Date();
  if (dateTextLower === 'today' || dateTextLower === 'сегодня') {
    return now;
  }
  if (dateTextLower === 'yesterday' || dateTextLower === 'вчера') {
    return moment(now).subtract(1, 'day').toDate();
  }
  if (dateTextLower === 'tomorrow' || dateTextLower === 'завтра') {
    return moment(now).add(1, 'day').toDate();
  }
  // 02.03 or 17/07 or 4.3 etc. <br />
  // Simplified date format, where first number is date, second is month
  const simplifiedDates = /^(\d{1,2})[.\\/](\d{1,2})$/gm.exec(dateTextLower);
  if (simplifiedDates !== null) {
    now.setDate(+simplifiedDates[1]);
    // month is zero-based
    now.setMonth(+simplifiedDates[2] - 1);
    return now;
  }
  // 1.1.1990 or 01.02.2021 or 01.02.20 or 1.2.20 etc. <br />
  // Full date format, where first number is date, second is month and third is year
  const fullDate = /^(\d{1,2})[.\\/](\d{1,2})[.\\/](\d{2,4})$/gm.exec(dateTextLower);
  if (fullDate !== null) {
    now.setDate(+fullDate[1]);
    // month is zero-based
    now.setMonth(+fullDate[2] - 1);

    const firstYearPart = String(Math.floor(now.getFullYear() / 100));
    let yearToken = fullDate[3];
    if (yearToken.length === 2) {
      yearToken = `${firstYearPart}${yearToken}`;
    }
    now.setFullYear(+yearToken);
    return now;
  }
  return undefined;
}

export function parseDateAsUnix(dateText: string): number | null {
  const parsedDate = parseDate(dateText);
  if (!parsedDate) {
    return null;
  }
  return toUnixDate(parsedDate);
}
