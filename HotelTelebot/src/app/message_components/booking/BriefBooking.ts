import moment from 'moment';
import PmsBookingEntity from '../../../api/entities/PmsBookingEntity';
import { fromSource, fromStatus } from '../../../utils/constants_mapper.helper';
import { daysBetween, toShortDate } from '../../../utils/dates.helper';

function BriefBooking(
  {
    moved,
    startDate,
    endDate,
    realRoomNumber,
    source,
    status,
    customerFirstName,
    customerLastName,
    addedDate,
    id,
    cdsTotal
  }: PmsBookingEntity
): string {
  const partOfBooking = moved ? ' ⚠ Это часть бронирования.' : '';
  return (
    `🧑️ ${customerFirstName} ${customerLastName}\n`
    + `📅 С ${toShortDate(startDate)} по ${toShortDate(endDate)}.`
    + ` ${daysBetween(startDate, endDate)} дней.\n`
    + `🚪 Комната <b>№${realRoomNumber}.${partOfBooking}</b>\n`
    + `Источник: <b>${fromSource(source)}</b>\n`
    + `Статус: <b>${fromStatus(status)}</b>\n`
    + `💳 Сумма: <b>${cdsTotal}</b>\n\n`
    + `<i>Обновлено ${moment(addedDate).format('llll')}\n</i>`
    + `<i>/id ${id}</i>`
  );
}

export default BriefBooking;
