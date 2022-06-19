import { MoreThan } from 'typeorm';
import { getRepository } from '../helpers/orm';
import { BookingNotificationModel } from './BookingNotificationModel';

const findNotificationsIdMoreThan = async (idMoreThan: number) => {
  const repo = getRepository(BookingNotificationModel);
  return repo.find({
    order: { createdAt: 'ASC' },
    where: { id: MoreThan(idMoreThan) }
  });
};

const countUnreadNotifications = async () => {
  const repo = getRepository(BookingNotificationModel);
  return repo.count({ where: { read: false } });
};

const findUnreadNotifications = async () => {
  const repo = getRepository(BookingNotificationModel);
  return repo.find({ where: { read: false } });
};

const markAsRead = async (notificationId: number) => {
  const repo = getRepository(BookingNotificationModel);
  await repo.update({ id: notificationId }, { read: true });
};

export default {
  findNotificationsIdMoreThan,
  countUnreadNotifications,
  findUnreadNotifications,
  markAsRead
};
