import { DATETIME_MOMENTJS } from '~/common/constants';
import { BookingDto } from '~/common/types';
import { formatDate } from '~/common/utils/dates';
import BriefBooking from './BriefBooking';

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
  return (BriefBooking(entity) + remindingText);
}

export default DetailedBooking;
