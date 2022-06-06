import { addToDate, subtractFromDate } from '~/common/utils/dates';

/**
 * @return date from given string
 */
function parseDateFromLiterals(dateLiterals: string): Date | null {
  const dateTextLower = dateLiterals.toLowerCase();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (dateTextLower === 'today' || dateTextLower === 'сегодня') {
    return now;
  }
  if (dateTextLower === 'yesterday' || dateTextLower === 'вчера') {
    return subtractFromDate({ date: now, amount: 1, unit: 'day' }).toDate();
  }
  if (dateTextLower === 'tomorrow' || dateTextLower === 'завтра') {
    return addToDate({ date: now, amount: 1, unit: 'day' }).toDate();
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
  return null;
}

export { parseDateFromLiterals };
