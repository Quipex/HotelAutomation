import { BookingNotificationDto } from '~/common/types';
import NewBookingNotification from './NewBookingNotification';
import UpdateBookingNotification from './UpdateBookingNotification';

const Notification = (notification: BookingNotificationDto) => {
  const { changelogLines } = notification;
  return changelogLines.length === 0 ? NewBookingNotification(notification) : UpdateBookingNotification(notification);
};

export default Notification;
