import { formatBookingPropertyValue as format } from '~/app/message_components/common/helpers';
import { BookingDto } from '~/common/types';
import { BookingStatus } from '../common';
import { daysBetween } from '~/common/utils/dates';

function PlainTextBooking(
  {
    startDate,
    endDateExclusive,
    room: { realRoomNumber },
    source,
    living,
    cancelled,
    prepaid,
    client: { fullNameOrig },
    updatedAt,
    id,
    totalUahCoins
  }: BookingDto
): string {
  const statusText = BookingStatus({
    living,
    cancelled,
    prepaid
  });
  const arriveText = format('startDate', startDate);
  const departText = format('endDateExclusive', endDateExclusive);
  const daysText = daysBetween(startDate, endDateExclusive);
  return (
    `Гость: ${fullNameOrig}\n`
    + `С ${arriveText} по ${departText}. ${daysText} дней.\n`
    + `Комната <b>№${realRoomNumber}</b>\n`
    + `Источник: <b>${format('source', source)}</b>\n`
    + `Статус: <b>${statusText}</b>\n`
    + `Сумма: <b>${format('totalUahCoins', totalUahCoins)}</b>\n\n`
    + `<i>Обновлено ${format('updatedAt', updatedAt)}\n</i>`
    + `<code>/id ${id}</code>`
  );
}

export default PlainTextBooking;
