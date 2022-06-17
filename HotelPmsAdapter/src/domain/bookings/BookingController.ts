import Router from 'koa-router';
import { BookingCreationConflictError } from '~/common/errors';
import { routesV1 } from '~/common/maps';
import { getPathOf } from '~/domain/helpers/routes';
import BookingPmsService from './BookingService';

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
  expiredRemind$get,
  confirmLiving$put,
  confirm$put
} = routesV1.bookings;

BookingController.post(
  getPathOf(index$post),
  async (ctx) => {
    ctx.body = await BookingPmsService.fetchPmsAndGetAllActiveBookings();
  }
);

BookingController.get(
  getPathOf(cached$get),
  async (ctx) => {
    ctx.body = await BookingPmsService.getAllBookings();
  }
);

BookingController.get(
  getPathOf(arrive$get),
  async (ctx) => {
    const { date: unixDate } = ctx.query as unknown as ReturnType<typeof arrive$get.getQueryParams>;
    if (!unixDate) {
      ctx.status = 400;
      return;
    }
    ctx.body = await BookingPmsService.getArrivalsBy(+unixDate);
  }
);

BookingController.get(
  getPathOf(added$get),
  async (ctx) => {
    const { after: unixDate } = ctx.query as unknown as ReturnType<typeof added$get.getQueryParams>;
    if (!unixDate) {
      ctx.status = 400;
      return;
    }
    ctx.body = await BookingPmsService.getBookingsAddedAfter(+unixDate);
  }
);

BookingController.get(
  getPathOf(byId$get),
  async (ctx) => {
    const { id } = ctx.params;
    const resp = await BookingPmsService.getBookingById(id);
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
    const { arrive_after: unixDate } = ctx.query as unknown as ReturnType<typeof notPaid$get.getQueryParams>;
    if (!unixDate) {
      ctx.status = 400;
      return;
    }
    ctx.body = await BookingPmsService.getBookingsNotPayedArriveAfter(+unixDate);
  }
);

BookingController.put(
  getPathOf(sync$put),
  async (ctx) => {
    await BookingPmsService.fetchPmsAndGetAllActiveBookings();
    ctx.status = 200;
  }
);

BookingController.put(
  getPathOf(confirm$put),
  async (ctx) => {
    const { bookingId } = ctx.request.body as ReturnType<typeof confirm$put.getData>;
    if (!bookingId) {
      ctx.status = 400;
      ctx.body = { message: 'missing booking id' };
      return;
    }
    await BookingPmsService.confirmPrepayment(bookingId);
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
    await BookingPmsService.confirmLiving(bookingId);
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
    await BookingPmsService.remindedOfPrepayment(bookingId);
    ctx.status = 200;
  }
);

BookingController.get(
  getPathOf(expiredRemind$get),
  async (ctx) => {
    ctx.body = await BookingPmsService.expiredRemindedPrepayment();
  }
);

BookingController.put(
  getPathOf(create$put),
  async (ctx) => {
    const {
      roomNumber, from, to, guestName
    } = ctx.request.body as ReturnType<typeof create$put.getData>;
    try {
      const newId = await BookingPmsService.createBookingAndSyncBookings({
        roomNumber: +roomNumber,
        from: new Date(from),
        to: new Date(to),
        guestName
      });
      ctx.body = { newId };
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
  getPathOf(owner.byId$get),
  async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await BookingPmsService.getBookingsByOwner(id);
  }
);

export default BookingController;
