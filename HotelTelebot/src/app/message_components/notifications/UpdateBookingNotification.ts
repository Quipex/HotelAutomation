/* eslint-disable prefer-template */
import { BookingNotificationDto } from '~/common/types';
import { resolveBooleanFromString } from '~/common/utils/primitives';
import { PlainTextBooking } from '~@components';
import { CertainBookingHashtag, Divider, FormattedDatetimeLine } from '../common';
import { ChangelogLine } from './common';

const UpdateBookingNotification = (update: BookingNotificationDto) => {
  const { booking, changelogLines, createdAt } = update;
  const { id: bookingId } = booking;
  const propertyCancelled = changelogLines.find((line) => line.property === 'cancelled');
  const justCancelled = propertyCancelled ? resolveBooleanFromString(propertyCancelled.newVal) : false;
  const changelogLinesText = changelogLines.map((line) => ChangelogLine(line)).join('\n');
  const title = justCancelled ? '❌ <b>Отмена бронирования</b>' : '🟡 <b>Изменение бронирования</b>';
  return `${title}\n`
    + `${FormattedDatetimeLine(createdAt)}\n\n`
    + (justCancelled ? '' : `${Divider()}\n${changelogLinesText}\n${Divider()}\n\n`)
    + `${PlainTextBooking(booking)}\n`
    + CertainBookingHashtag(bookingId);
};

export default UpdateBookingNotification;
