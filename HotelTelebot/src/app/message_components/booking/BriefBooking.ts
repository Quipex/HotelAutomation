import { DATE_SHORT, DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { BookingDto } from '~/common/types';
import { daysBetween, formatDate } from '~/common/utils/dates';
import { sourceToText, getStatusText } from '~/common/utils/constants_mapper';

function BriefBooking(
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
  const statusText = getStatusText({
    living,
    cancelled,
    prepaid
  });
  const price = (Number(totalUahCoins) / 100).toFixed(2);
  return (
    `🧑️ ${fullNameOrig}\n`
    + `📅 С ${formatDate(startDate, DATE_SHORT)} по ${formatDate(endDateExclusive, DATE_SHORT)}.`
    + ` ${daysBetween(startDate, endDateExclusive)} дней.\n`
    + `🚪 Комната <b>№${realRoomNumber}</b>\n`
    + `Источник: <b>${sourceToText(source)}</b>\n`
    + `Статус: <b>${statusText}</b>\n`
    + `💳 Сумма: <b>${price}</b>\n\n`
    + `<i>Обновлено ${formatDate(updatedAt, DATETIME_DAYOFWEEK_MOMENTJS)}\n</i>`
    + `<code>/id ${id}</code>`
  );
}

export default BriefBooking;
