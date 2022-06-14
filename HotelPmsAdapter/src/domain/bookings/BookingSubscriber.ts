/* eslint-disable class-methods-use-this,@typescript-eslint/no-unused-vars */
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { createNotificationOnBookingUpdate, createNotificationOnNewBooking } from './helpers/hooks';
import { BookingModel } from './BookingModel';

@EventSubscriber()
class BookingSubscriber implements EntitySubscriberInterface<BookingModel> {
  listenTo(): Function | string {
    return BookingModel;
  }

  async afterInsert(event: InsertEvent<BookingModel>) {
    await createNotificationOnNewBooking(event);
  }

  async afterUpdate(event: UpdateEvent<BookingModel>) {
    await createNotificationOnBookingUpdate(event);
  }
}

export { BookingSubscriber };
