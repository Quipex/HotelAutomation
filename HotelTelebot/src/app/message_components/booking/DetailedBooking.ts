import { DATETIME_MOMENTJS } from '~/common/constants';
import { BookingDto } from '~/common/types';
import { formatDate, timeFromNow } from '~/common/utils/dates';
import ColorfulBooking from './ColorfulBooking';

function DetailedBooking(
  entity: BookingDto
): string {
  const { prepaymentRemindings } = entity;
  const remindings = prepaymentRemindings
    .map((reminding) => `${formatDate(reminding.createdAt, DATETIME_MOMENTJS)} (${timeFromNow(reminding.createdAt)})`)
    .join('\n');
  const remindingText = prepaymentRemindings.length > 0
    ? `\nНапомнили за предоплату:\n${remindings}`
    : '';
  return (ColorfulBooking(entity) + remindingText);
}

export default DetailedBooking;
