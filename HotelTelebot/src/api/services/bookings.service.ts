import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { BookingDto } from '~/common/types';
import { BookingCreationPayload } from '~/common/types/routes.v1.types';
import { log } from '~/config/logger';
import { rv1 } from './helpers';

async function fetchBookingById(bookingId: string) {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.bookings.byId$get);
  const path = withPathVariable(fullPath, bookingId);
  return await api.call(path, { method }) as BookingDto;
}

async function fetchBookingsAddedAfter(unixDate: number) {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.added$get);
  const params = getQueryParams({ after: unixDate });
  return await api.call(path, { method, params }) as BookingDto[];
}

async function fetchBookingsArriveAt(unixDate: number) {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.arrive$get);
  const params = getQueryParams({ date: unixDate });
  return await api.call(path, { method, params }) as BookingDto[];
}

async function fetchBookingsExpiredAndReminded() {
  const { path, method } = rv1(routesV1.bookings.expiredRemind$get);
  return await api.call(path, { method }) as BookingDto[];
}

async function fetchNotPayedBookingsArriveAfter(unixDate: number) {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.notPaid$get);
  const params = getQueryParams({ arrive_after: unixDate });
  return await api.call(path, { method, params }) as BookingDto[];
}

async function confirmBooking(bookingId: string) {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.confirm$put);
  const data = getData({ bookingId });
  await api.call(path, { data, method });
}

async function confirmLiving(bookingId: string) {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.confirmLiving$put);
  const data = getData({ bookingId });
  return api.call(path, { data, method });
}

async function createBooking(createPayload: BookingCreationPayload) {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.create$put);
  const data = getData(createPayload);
  return api.call(path, { data, method });
}

async function putRemindedPrepayment(bookingId: string) {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.remindedPrepayment$put);
  const data = getData({ bookingId });
  await api.call(path, { data, method });
}

async function syncBookings() {
  const { path, method } = rv1(routesV1.bookings.sync$put);
  await api.call(path, { method });
}

async function fetchClientBookings(clientId: string) {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.bookings.owner.byId$get);
  const path = withPathVariable(fullPath, clientId);
  return await api.call(path, { method }) as BookingDto[];
}

async function moveBookingInBatch(...any: any): Promise<any> {
  log.error('Not implemented', { any });
  throw new Error('Not implemented');
}

async function moveBooking(...any: any): Promise<any> {
  log.error('Not implemented', { any });
  throw new Error('Not implemented');
}

async function fetchBookingsArriveAtAndNotLiving(...any: any): Promise<any> {
  log.error('Not implemented', { any });
  throw new Error('Not implemented');
}

export default {
  fetchBookingById,
  fetchBookingsAddedAfter,
  fetchBookingsArriveAt,
  fetchBookingsExpiredAndReminded,
  fetchNotPayedBookingsArriveAfter,
  confirmBooking,
  confirmLiving,
  createBooking,
  putRemindedPrepayment,
  syncBookings,
  fetchClientBookings,
  moveBookingInBatch,
  moveBooking,
  fetchBookingsArriveAtAndNotLiving
};
