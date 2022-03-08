import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { resolveV1 } from '~/common/utils/routes';
import BookingPmsService from './BookingService';

const bookings = new Router();

const {
  index$post,
  cached$get,
  arrive$get,
  added$get,
  byId$get,
  notPayed$get,
  owner,
  sync$put,
  create$put,
  remindedPrepayment$put,
  expiredRemind$get,
  confirmLiving$put,
  confirm$put
} = routesV1.bookings;

const getPathOf = (obj) => resolveV1(obj).path;

bookings.post(getPathOf(index$post), async () => {
  return BookingPmsService.fetchPmsAndGetAllBookings();
});

bookings.get(getPathOf(cached$get), async () => {
  return BookingPmsService.getAllBookings();
});

bookings.get(getPathOf(arrive$get), async (ctx) => {
  const { date: unixDate } = ctx.query as unknown as ReturnType<typeof arrive$get.getQueryParams>;
  if (!unixDate) {
    ctx.status = 400;
    return;
  }
  ctx.body = await BookingPmsService.getArrivalsBy(+unixDate);
});

bookings.get(getPathOf(added$get), async (ctx) => {
  const { after: unixDate } = ctx.query as unknown as ReturnType<typeof added$get.getQueryParams>;
  if (!unixDate) {
    ctx.status = 400;
    return;
  }
  ctx.body = await BookingPmsService.getBookingsAddedAfter(+unixDate);
});

bookings.get(getPathOf(byId$get), async (ctx) => {
  const { id } = ctx.params;
  const resp = await BookingPmsService.getBookingById(id);
  if (resp) {
    ctx.body = resp;
  } else {
    ctx.status = 204;
  }
});

bookings.get(getPathOf(notPayed$get), async (ctx) => {
  const { arrive_after: unixDate } = ctx.query as unknown as ReturnType<typeof notPayed$get.getQueryParams>;
  if (!unixDate) {
    ctx.status = 400;
    return;
  }
  ctx.body = await BookingPmsService.getBookingsNotPayedArriveAfter(+unixDate);
});

bookings.put(getPathOf(sync$put), async (ctx) => {
  await BookingPmsService.fetchPmsAndGetAllBookings();
  ctx.status = 200;
});

bookings.put(getPathOf(confirm$put), async (ctx) => {
  const { bookingId } = ctx.request.body as ReturnType<typeof confirm$put.getData>;
  if (!bookingId) {
    ctx.status = 400;
    ctx.body = { message: 'missing booking id' };
  }
  await BookingPmsService.confirmPrepayment(bookingId);
  ctx.status = 200;
});

bookings.put(getPathOf(confirmLiving$put), async (ctx) => {
  const { bookingId } = ctx.request.body as ReturnType<typeof confirmLiving$put.getData>;
  if (!bookingId) {
    ctx.status = 400;
    ctx.body = { message: 'missing booking id' };
  }
  await BookingPmsService.confirmLiving(bookingId);
  ctx.status = 200;
});

bookings.put(getPathOf(remindedPrepayment$put), async (ctx) => {
  const { bookingId } = ctx.request.body as ReturnType<typeof remindedPrepayment$put.getData>;
  if (!bookingId) {
    ctx.status = 400;
    ctx.body = { message: 'missing booking id' };
  }
  await BookingPmsService.remindedOfPrepayment(bookingId);
  ctx.status = 200;
});

bookings.get(getPathOf(expiredRemind$get), async (ctx) => {
  ctx.body = await BookingPmsService.expiredRemindedPrepayment();
});

bookings.put(getPathOf(create$put), async (ctx) => {
  const {
    roomNumber, from, to, guestName
  } = ctx.request.body as ReturnType<typeof create$put.getData>;
  const newId = await BookingPmsService.createBooking({
    roomNumber: +roomNumber,
    from: new Date(from),
    to: new Date(to),
    guestName
  });
  ctx.body = { newId };
});

bookings.get(getPathOf(owner.byId$get), async (ctx) => {
  const { id } = ctx.params;
  ctx.body = await BookingPmsService.getBookingsByOwner(id);
});

export default bookings;
