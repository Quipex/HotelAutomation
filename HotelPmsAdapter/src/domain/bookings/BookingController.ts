import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { resolveV1 } from '~/common/utils/routes';
import BookingPmsService from './BookingService';

const bookings = new Router();

const bk = routesV1.bookings;

const getPathOf = (obj) => resolveV1(obj).path;

bookings.post(getPathOf(bk.index$post), async () => {
  return BookingPmsService.fetchPmsAndGetAllBookings();
});

bookings.get(getPathOf(bk.cached$get), async () => {
  return BookingPmsService.getAllBookings();
});

bookings.get(getPathOf(bk.arrive$get), async (ctx) => {
  const { date: unixDate } = ctx.query;
  if (!unixDate) {
    ctx.status = 400;
    return;
  }
  ctx.body = await BookingPmsService.getArrivalsBy(+unixDate);
});

bookings.get(getPathOf(bk.added$get), async (ctx) => {
  const { after: unixDate } = ctx.query;
  if (!unixDate) {
    ctx.status = 400;
    return;
  }
  ctx.body = await BookingPmsService.getBookingsAddedAfter(+unixDate);
});

bookings.get(getPathOf(bk.byId$get), async (ctx) => {
  const { id } = ctx.params;
  const resp = await BookingPmsService.getBookingById(id);
  if (resp) {
    ctx.body = resp;
  } else {
    ctx.status = 204;
  }
});

bookings.get(getPathOf(bk.notPayed$get), async (ctx) => {
  const { arrive_after: unixDate } = ctx.query;
  if (!unixDate) {
    ctx.status = 400;
    return;
  }
  ctx.body = await BookingPmsService.getBookingsNotPayedArriveAfter(+unixDate);
});

bookings.put(getPathOf(bk.sync$put), async (ctx) => {
  await BookingPmsService.fetchPmsAndGetAllBookings();
  ctx.status = 200;
});

bookings.put(getPathOf(bk.confirm$put), async (ctx) => {
  const { bookingId } = ctx.request.body;
  if (!bookingId) {
    ctx.status = 400;
    ctx.body = { message: 'missing booking id' };
  }
  await BookingPmsService.confirmPrepayment(bookingId);
  ctx.status = 200;
});

bookings.put(getPathOf(bk.confirmLiving$put), async (ctx) => {
  const { bookingId } = ctx.request.body;
  if (!bookingId) {
    ctx.status = 400;
    ctx.body = { message: 'missing booking id' };
  }
  await BookingPmsService.confirmLiving(bookingId);
  ctx.status = 200;
});

bookings.put(getPathOf(bk.remindedPrepayment$put), async (ctx) => {
  const { bookingId } = ctx.request.body;
  if (!bookingId) {
    ctx.status = 400;
    ctx.body = { message: 'missing booking id' };
  }
  await BookingPmsService.remindedOfPrepayment(bookingId);
  ctx.status = 200;
});

bookings.get(getPathOf(bk.expiredRemind$get), async (ctx) => {
  ctx.body = await BookingPmsService.expiredRemindedPrepayment();
});

bookings.put(getPathOf(bk.create$put), async (ctx) => {
  const {
    roomNumber, from, to, guestName
  } = ctx.request.body;
  const newId = await BookingPmsService.createBooking({
    roomNumber: +roomNumber,
    from: new Date(from),
    to: new Date(to),
    guestName
  });
  ctx.body = { newId };
});

bookings.get(getPathOf(bk.owner.byId$get), async (ctx) => {
  const { id } = ctx.params;
  ctx.body = await BookingPmsService.getBookingsByOwner(id);
});

export default bookings;
