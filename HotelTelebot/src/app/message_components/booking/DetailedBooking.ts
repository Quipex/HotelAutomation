import { DATETIME_MOMENTJS } from '~/common/constants';
import { BookingDto } from '~/common/types';
import { formatDate } from '~/common/utils/dates';
import ColorfulBooking from './ColorfulBooking';

function DetailedBooking(
  entity: BookingDto
): string {
  const { prepaymentRemindings } = entity;
  const remindings = prepaymentRemindings
    .map((reminding) => formatDate(reminding.createdAt, DATETIME_MOMENTJS))
    .join('\n');
  const remindingText = prepaymentRemindings.length > 0
    ? `\nНапомнил за предоплату:\n${remindings}`
    : '';
  return (ColorfulBooking(entity) + remindingText);
}

export default DetailedBooking;
