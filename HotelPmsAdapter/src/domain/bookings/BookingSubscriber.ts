/* eslint-disable class-methods-use-this,@typescript-eslint/no-unused-vars */
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { STATUSES_MANUAL_CREATION } from '~/common/constants';
import { log } from '~/config/logger';
import {
  BookingNotificationChangelogLineModel
} from '~/domain/booking_notifications_changelog_lines/BookingNotificationChangelogLineModel';
import { BookingNotificationModel } from '../booking_notifications/BookingNotificationModel';
import { getRepository } from '../helpers/orm';
import { BookingModel } from './BookingModel';

@EventSubscriber()
class BookingSubscriber implements EntitySubscriberInterface<BookingModel> {
  listenTo(): Function | string {
    return BookingModel;
  }

  async afterInsert(event: InsertEvent<BookingModel>) {
    // This is a workaround for typeorm auto-transaction management. It creates a nested transaction after inserting
    // booking and therefore when we're trying to create a notification with corresponding `booking_id` it says that
    // such id doesn't exist (it wasn't previously committed by the higher-level transaction)
    if (event.queryRunner.isTransactionActive) {
      await event.queryRunner.commitTransaction();
      await event.queryRunner.startTransaction();
    }

    const { entity } = event;
    if (STATUSES_MANUAL_CREATION.includes(entity.source)) {
      return;
    }
    log.info('Got new booking, creating notification');
    const newBookingNotification = new BookingNotificationModel();
    newBookingNotification.id = undefined;
    newBookingNotification.booking = entity;
    const bookingNotificationsRepo = getRepository(BookingNotificationModel);
    // eslint-disable-next-line consistent-return
    await bookingNotificationsRepo.save(newBookingNotification);
  }

  afterUpdate(event: UpdateEvent<BookingModel>) {
    const { entity, updatedColumns, databaseEntity } = event;
    if (STATUSES_MANUAL_CREATION.includes(entity.source)) {
      return;
    }
    log.info('Updating existing booking, creating notification');
    const updatedBookingNotification = new BookingNotificationModel();
    updatedBookingNotification.booking = databaseEntity;
    updatedBookingNotification.id = undefined;
    const bookingNotificationsRepo = getRepository(BookingNotificationModel);
    updatedBookingNotification.changelogLines = updatedColumns.map((col) => {
      const changelogLine = new BookingNotificationChangelogLineModel();
      const { propertyName } = col;
      changelogLine.id = undefined;
      changelogLine.property = propertyName;
      changelogLine.oldVal = databaseEntity[propertyName];
      changelogLine.newVal = entity[propertyName];
      return changelogLine;
    });
    // eslint-disable-next-line consistent-return
    return bookingNotificationsRepo.save(updatedBookingNotification);
  }
}

export { BookingSubscriber };
