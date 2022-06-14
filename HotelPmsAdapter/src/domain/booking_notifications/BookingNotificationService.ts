import { mapBookingNotification2dto } from '~/common/mappings/dto';
import { BookingNotificationDto } from '~/common/types';
import BookingNotificationRepository from './BookingNotificationRepository';

const getNotificationsWithIdMoreThan = async (idAfter: number): Promise<BookingNotificationDto[]> => {
  const notifications = await BookingNotificationRepository.findNotificationsIdMoreThan(idAfter);
  return notifications.map(mapBookingNotification2dto);
};

export default { getNotificationsWithIdMoreThan };
