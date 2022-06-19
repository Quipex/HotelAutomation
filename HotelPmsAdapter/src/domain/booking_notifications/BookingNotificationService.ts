import { mapBookingNotification2dto } from '~/common/mappings/dto';
import { BookingNotificationDto } from '~/common/types';
import BookingNotificationRepository from './BookingNotificationRepository';

const getNotificationsWithIdMoreThan = async (idAfter: number): Promise<BookingNotificationDto[]> => {
  const notifications = await BookingNotificationRepository.findNotificationsIdMoreThan(idAfter);
  return notifications.map(mapBookingNotification2dto);
};

const getNumberOfUnreadNotifications = async (): Promise<number> => {
  return BookingNotificationRepository.countUnreadNotifications();
};

const getUnreadNotifications = async (): Promise<BookingNotificationDto[]> => {
  const notifications = await BookingNotificationRepository.findUnreadNotifications();
  return notifications.map(mapBookingNotification2dto);
};

const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await BookingNotificationRepository.markAsRead(notificationId);
};

export default {
  getNotificationsWithIdMoreThan,
  getNumberOfUnreadNotifications,
  getUnreadNotifications,
  markNotificationAsRead
};
