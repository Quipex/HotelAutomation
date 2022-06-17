/* eslint-disable prefer-template */
import { PlainTextBooking } from '@components';
import { BookingNotificationDto } from '~/common/types';
import { CertainBookingHashtag, FormattedDatetimeLine } from '../common';

const NewBookingNotification = (notification: BookingNotificationDto): string => {
  const { booking, createdAt } = notification;
  const { cancelled: isCancelled, id: bookingId } = booking;
  const title = isCancelled ? '💀 <b>Новое бронирование (отменённое)</b>' : '✳ <b>Новое бронирование</b>';
  return `${title}\n`
    + `${FormattedDatetimeLine(createdAt)}\n\n`
    + `${PlainTextBooking(booking)}\n`
    + CertainBookingHashtag(bookingId);
};

export default NewBookingNotification;
