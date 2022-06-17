import { formatBookingPropertyValue, getRelativeStatusMessage } from '~/app/message_components/common/helpers';
import { BookingDto } from '~/common/types';
import { daysBetween } from '~/common/utils/dates';
import { BookingStatus } from '../common';

const format: typeof formatBookingPropertyValue = (prop, val) => {
  return formatBookingPropertyValue(prop, val, { emojified: true });
};

function ColorfulBooking(
  booking: BookingDto
): string {
  const {
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
  } = booking;
  const statusText = BookingStatus({
    living,
    cancelled,
    prepaid
  }, { emojified: true });
  const arriveText = format('startDate', startDate);
  const departText = format('endDateExclusive', endDateExclusive);
  const daysText = daysBetween(startDate, endDateExclusive);
  return (
    `🧑️ :  ${fullNameOrig}\n`
    + `📅 :  С ${arriveText} по ${departText}. ${daysText} дней.\n`
    + `🚪 :  Комната <b>№${realRoomNumber}</b>\n`
    + `Источник: <b>${format('source', source)}</b>\n`
    + `Статус: <b>${statusText}</b>\n`
    + `💳 :  Сумма: <b>${format('totalUahCoins', totalUahCoins)}</b>\n\n`
    + `<i>${getRelativeStatusMessage(booking)}</i>\n\n`
    + `<i>Обновлено ${format('updatedAt', updatedAt)}\n</i>`
    + `<code>/id ${id}</code>`
  );
}

export default ColorfulBooking;
