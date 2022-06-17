import { UpdateEvent } from 'typeorm';
import { STATUSES_MANUAL_CREATION } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';
import { log } from '~/config/logger';
import { BookingNotificationModel } from '~/domain/booking_notifications/BookingNotificationModel';
import {
  BookingNotificationChangelogLineModel
} from '~/domain/booking_notifications_changelog_lines/BookingNotificationChangelogLineModel';
import { getRepository } from '~/domain/helpers/orm';
import { BookingModel } from '../../BookingModel';

const createNotificationOnBookingUpdate = async (event: UpdateEvent<BookingModel>) => {
  const { entity: updatingEntity, updatedColumns, databaseEntity } = event;
  if (STATUSES_MANUAL_CREATION.includes(updatingEntity.source) || !databaseEntity || !updatingEntity) {
    return;
  }

  log.info(`Updating existing booking '${databaseEntity.id}', creating notification`);
  const updatedBookingNotification = new BookingNotificationModel();
  updatedBookingNotification.booking = databaseEntity;
  updatedBookingNotification.id = undefined;
  const bookingNotificationsRepo = getRepository(BookingNotificationModel);
  updatedBookingNotification.changelogLines = updatedColumns.map((col) => {
    const changelogLine = new BookingNotificationChangelogLineModel();
    const { propertyName, type } = col;
    changelogLine.id = undefined;
    changelogLine.property = propertyName;
    const isDateProperty = type === 'date';
    changelogLine.oldVal = databaseEntity[propertyName];
    changelogLine.newVal = isDateProperty ? formatDate(updatingEntity[propertyName]) : updatingEntity[propertyName];
    return changelogLine;
  });
  // eslint-disable-next-line consistent-return
  return bookingNotificationsRepo.save(updatedBookingNotification);
};

export { createNotificationOnBookingUpdate };
