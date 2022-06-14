import { BookingNotificationDto } from '~/common/types';
import { BookingNotificationModel } from '~/domain/booking_notifications/BookingNotificationModel';
import { mapBookingModel2dto } from './bookingModel2dto';

const mapBookingNotification2dto = (bookingNotification: BookingNotificationModel): BookingNotificationDto => {
  const { id, booking, createdAt, read, changelogLines } = bookingNotification;
  return {
    id,
    createdAt: createdAt.toISOString(),
    read,
    changelogLines,
    booking: mapBookingModel2dto(booking)
  };
};

export { mapBookingNotification2dto };
