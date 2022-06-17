import { DATE_GENERAL } from '~/common/constants';
import { BookingDto } from '~/common/types';
import { dateAfterAnother, dateBeforeAnother, daysBetween, formatDate } from '~/common/utils/dates';

const getRelativeStatusMessage = (booking: BookingDto): string => {
  const { startDate, endDateExclusive } = booking;
  const todayAsString = formatDate(new Date(), DATE_GENERAL);
  const arrivalAsString = formatDate(startDate, DATE_GENERAL);
  const departureAsString = formatDate(endDateExclusive, DATE_GENERAL);

  const isArrivalDay = todayAsString === arrivalAsString;
  const isDepartureDay = todayAsString === departureAsString;
  const isBeforeArrivalDay = dateBeforeAnother(todayAsString, arrivalAsString, 'days');
  const isAfterDepartureDay = dateAfterAnother(todayAsString, departureAsString, 'days');

  if (isArrivalDay) {
    return 'Сегодня заселение 📥';
  }
  if (isDepartureDay) {
    return 'Сегодня выселение 📤';
  }
  if (isBeforeArrivalDay) {
    const number = daysBetween(todayAsString, arrivalAsString);
    const text = number === 1 ? '<b>завтра❗</b>' : `через <b>${number}</b> дней`;
    return `Заселение 📥 ${text}`;
  }
  if (isAfterDepartureDay) {
    const number = daysBetween(departureAsString, todayAsString);
    const text = number === 1 ? '<b>вчера</b>' : `<b>${number}</b> дней назад`;
    return `Выселение 📤 было ${text}`;
  }
  const daysToDeparture = daysBetween(todayAsString, departureAsString);
  const departureDaysText = daysToDeparture === 1 ? '<b>завтра❗</b>' : `через <b>${daysToDeparture - 1}</b> дней`;
  return `Проживает <b>${daysBetween(arrivalAsString, todayAsString) + 1}</b> дней (включая сегодня).`
    + `\nВыселение ${departureDaysText}`;
};

export { getRelativeStatusMessage };
