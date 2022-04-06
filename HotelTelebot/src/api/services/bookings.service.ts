import PmsBookingEntity from '@entities/PmsBookingEntity';
import { BookingCreationPayload } from '~/common/types/routes.v1.types';
import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { rv1 } from './helpers';

async function fetchBookingById(bookingId: string): Promise<PmsBookingEntity> {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.bookings.byId$get);
  const path = withPathVariable(bookingId, fullPath);
  return await api.call(path, { method }) as PmsBookingEntity;
}

async function fetchBookingsAddedAfter(unixDate: number): Promise<PmsBookingEntity[]> {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.added$get);
  const params = getQueryParams({ after: unixDate });
  return await api.call(path, { method, params }) as [];
}

async function fetchBookingsArriveAt(unixDate: number): Promise<PmsBookingEntity[]> {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.arrive$get);
  const params = getQueryParams({ date: unixDate });
  return await api.call(path, { method, params }) as [];
}

async function fetchBookingsExpiredAndReminded(): Promise<PmsBookingEntity[]> {
  const { path, method } = rv1(routesV1.bookings.expiredRemind$get);
  return await api.call(path, { method }) as [];
}

async function fetchNotPayedBookingsArriveAfter(unixDate: number): Promise<PmsBookingEntity[]> {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.notPayed$get);
  const params = getQueryParams({ arrive_after: unixDate });
  return await api.call(path, { method, params }) as [];
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

async function fetchClientBookings(clientId: string): Promise<PmsBookingEntity[]> {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.bookings.owner.byId$get);
  const path = withPathVariable(clientId, fullPath);
  return await api.call(path, { method }) as [];
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
  fetchClientBookings
};
