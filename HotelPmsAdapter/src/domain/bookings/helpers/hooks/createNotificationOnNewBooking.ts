import { InsertEvent } from 'typeorm';
import { STATUSES_MANUAL_CREATION } from '~/common/constants';
import { log } from '~/config/logger';
import { BookingNotificationModel } from '~/domain/booking_notifications/BookingNotificationModel';
import { getRepository } from '~/domain/helpers/orm';
import { BookingModel } from '../../BookingModel';

const createNotificationOnNewBooking = async (event: InsertEvent<BookingModel>) => {
  const { entity } = event;
  if (STATUSES_MANUAL_CREATION.includes(entity.source)) {
    return;
  }

  // This is a workaround for typeorm auto-transaction management. It creates a nested transaction after inserting
  // booking and therefore when we're trying to create a notification with corresponding `booking_id` it says that
  // such id doesn't exist (it wasn't previously committed by the higher-level transaction)
  if (event.queryRunner.isTransactionActive) {
    await event.queryRunner.query('COMMIT');
    await event.queryRunner.query('START TRANSACTION');
  }

  log.info(`Got new booking '${entity.id}', creating notification`);
  const newBookingNotification = new BookingNotificationModel();
  newBookingNotification.id = undefined;
  newBookingNotification.booking = entity;
  const bookingNotificationsRepo = getRepository(BookingNotificationModel);
  // eslint-disable-next-line consistent-return
  await bookingNotificationsRepo.save(newBookingNotification);
};

export { createNotificationOnNewBooking };
