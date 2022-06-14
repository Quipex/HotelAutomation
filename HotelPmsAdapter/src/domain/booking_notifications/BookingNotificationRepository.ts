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

export default { findNotificationsIdMoreThan };
