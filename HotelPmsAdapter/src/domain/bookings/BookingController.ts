import Router from 'koa-router';
import { BookingCreationConflictError } from '~/common/errors';
import { routesV1 } from '~/common/maps';
import { QueryParams } from '~/common/types';
import { resolveBooleanFromString } from '~/common/utils/primitives';
import { getPathOf } from '~/domain/helpers/routes';
import BookingService from './BookingService';

const BookingController = new Router();

const {
  index$post,
  cached$get,
  arrive$get,
  added$get,
  byId$get,
  notPaid$get,
  owner,
  sync$put,
  create$put,
  remindedPrepayment$put,
  confirmLiving$put,
  confirmPrepayment$put,
  cancel$put,
  livingNotMarked$get,
  setNote$patch,
  note$get
} = routesV1.bookings;

BookingController.post(
  getPathOf(index$post),
  async (ctx) => {
    ctx.body = await BookingService.fetchPmsAndGetAllActiveBookings();
  }
);

BookingController.get(
  getPathOf(cached$get),
  async (ctx) => {
    ctx.body = await BookingService.getAllBookings();
  }
);

BookingController.get(
  getPathOf(arrive$get),
  async (ctx) => {
    const { on: utcDate } = ctx.query as unknown as QueryParams<typeof arrive$get.getQueryParams>;
    if (!utcDate) {
      ctx.status = 400;
      return;
    }
    ctx.body = await BookingService.getArrivalsBy(utcDate);
  }
);

BookingController.get(
  getPathOf(added$get),
  async (ctx) => {
    const {
      after: utcDate
    } = ctx.query as unknown as QueryParams<typeof added$get.getQueryParams>;
    if (!utcDate) {
      ctx.status = 400;
      return;
    }
    ctx.body = await BookingService.getBookingsAddedAfter(utcDate);
  }
);

BookingController.get(
  getPathOf(byId$get),
  async (ctx) => {
    const { id } = ctx.params;
    const resp = await BookingService.getBookingById(id);
    if (resp) {
      ctx.body = resp;
    } else {
      ctx.status = 204;
    }
  }
);

BookingController.get(
  getPathOf(notPaid$get),
  async (ctx) => {
    const {
      arrive_after: utcDate,
      wereReminded,
      expired
    } = ctx.query as unknown as QueryParams<typeof notPaid$get.getQueryParams>;
    if (!utcDate) {
      ctx.status = 400;
      return;
    }
    ctx.body = await BookingService.getBookingsNotPayedArriveAfter(
      utcDate,
      resolveBooleanFromString(wereReminded),
      resolveBooleanFromString(expired)
    );
  }
);

BookingController.put(
  getPathOf(sync$put),
  async (ctx) => {
    await BookingService.fetchPmsAndGetAllActiveBookings();
    ctx.status = 200;
  }
);

BookingController.put(
  getPathOf(confirmPrepayment$put),
  async (ctx) => {
    const { bookingId } = ctx.request.body as ReturnType<typeof confirmPrepayment$put.getData>;
    if (!bookingId) {
      ctx.status = 400;
      ctx.body = { message: 'missing booking id' };
      return;
    }
    await BookingService.confirmPrepayment(bookingId);
    ctx.status = 200;
  }
);

BookingController.put(
  getPathOf(confirmLiving$put),
  async (ctx) => {
    const { bookingId } = ctx.request.body as ReturnType<typeof confirmLiving$put.getData>;
    if (!bookingId) {
      ctx.status = 400;
      ctx.body = { message: 'missing booking id' };
      return;
    }
    await BookingService.confirmLiving(bookingId);
    ctx.status = 200;
  }
);

BookingController.put(
  getPathOf(remindedPrepayment$put),
  async (ctx) => {
    const { bookingId } = ctx.request.body as ReturnType<typeof remindedPrepayment$put.getData>;
    if (!bookingId) {
      ctx.status = 400;
      ctx.body = { message: 'missing booking id' };
      return;
    }
    await BookingService.remindedOfPrepayment(bookingId);
    ctx.status = 200;
  }
);

BookingController.put(
  getPathOf(create$put),
  async (ctx) => {
    const {
      roomNumber, from, to, guestName
    } = ctx.request.body as ReturnType<typeof create$put.getData>;
    try {
      const newId = await BookingService.createBookingAndSyncBookings({
        roomNumber: +roomNumber,
        from: new Date(from),
        to: new Date(to),
        guestName
      });
      ctx.body = { newId };
      ctx.status = 200;
    } catch (e: unknown) {
      if (e instanceof BookingCreationConflictError) {
        ctx.status = 409;
        ctx.body = { message: e.message };
        return;
      }
      throw e;
    }
  }
);

BookingController.get(
  getPathOf(livingNotMarked$get),
  async (ctx) => {
    const { date } = ctx.query as unknown as QueryParams<typeof livingNotMarked$get.getQueryParams>;
    ctx.body = await BookingService.getLivingButNotMarkedBy(date);
  }
);

BookingController.put(
  getPathOf(cancel$put),
  async (ctx) => {
    const { bookingId } = ctx.request.body as ReturnType<typeof cancel$put.getData>;
    if (!bookingId) {
      ctx.status = 400;
      ctx.body = { message: 'missing booking id' };
      return;
    }
    await BookingService.cancelBooking(bookingId);
    ctx.status = 200;
  }
);

BookingController.get(
  getPathOf(owner.byId$get),
  async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await BookingService.getBookingsByOwner(id);
  }
);

BookingController.patch(
  getPathOf(setNote$patch),
  async (ctx) => {
    const { id, noteText } = ctx.request.body as ReturnType<typeof setNote$patch.getData>;
    await BookingService.setNote(id, noteText);
    ctx.status = 200;
  }
);

BookingController.get(
  getPathOf(note$get),
  async (ctx) => {
    const { id } = ctx.query as unknown as QueryParams<typeof note$get.getQueryParams>;
    ctx.body = await BookingService.getNote(id);
  }
);

export default BookingController;
