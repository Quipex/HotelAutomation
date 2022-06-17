import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { BookingDto } from '~/common/types';
import { BookingCreationPayload } from '~/common/types/routes.v1.types';
import { log } from '~/config/logger';
import { rv1 } from './helpers';

const fetchBookingById = async (bookingId: string) => {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.bookings.byId$get);
  const path = withPathVariable(fullPath, bookingId);
  return await api.call(path, { method }) as BookingDto;
};

const fetchBookingsAddedAfter = async (unixDate: number) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.added$get);
  const params = getQueryParams({ after: unixDate });
  return await api.call(path, { method, params }) as BookingDto[];
};

const fetchBookingsArriveAt = async (unixDate: number) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.arrive$get);
  const params = getQueryParams({ date: unixDate });
  return await api.call(path, { method, params }) as BookingDto[];
};

const fetchBookingsExpiredAndReminded = async () => {
  const { path, method } = rv1(routesV1.bookings.expiredRemind$get);
  return await api.call(path, { method }) as BookingDto[];
};

const fetchNotPayedBookingsArriveAfter = async (unixDate: number) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.bookings.notPaid$get);
  const params = getQueryParams({ arrive_after: unixDate });
  return await api.call(path, { method, params }) as BookingDto[];
};

const confirmPrepayment = async (bookingId: string) => {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.confirmPrepayment$put);
  const data = getData({ bookingId });
  await api.call(path, { data, method });
};

const confirmLiving = async (bookingId: string) => {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.confirmLiving$put);
  const data = getData({ bookingId });
  return api.call(path, { data, method });
};

const createBooking = async (createPayload: BookingCreationPayload) => {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.create$put);
  const data = getData(createPayload);
  return api.call(path, { data, method });
};

const putRemindedPrepayment = async (bookingId: string) => {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.remindedPrepayment$put);
  const data = getData({ bookingId });
  await api.call(path, { data, method });
};

const syncBookings = async () => {
  const { path, method } = rv1(routesV1.bookings.sync$put);
  await api.call(path, { method });
};

const fetchClientBookings = async (clientId: string) => {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.bookings.owner.byId$get);
  const path = withPathVariable(fullPath, clientId);
  return await api.call(path, { method }) as BookingDto[];
};

const moveBookingInBatch = async (...any: any): Promise<any> => {
  log.error('Not implemented', { any });
  throw new Error('Not implemented');
};

const moveBooking = async (...any: any): Promise<any> => {
  log.error('Not implemented', { any });
  throw new Error('Not implemented');
};

const fetchBookingsArriveAtAndNotLiving = async (...any: any): Promise<any> => {
  log.error('Not implemented', { any });
  throw new Error('Not implemented');
};

const cancelBooking = async (bookingId: string) => {
  const { path, method, compactPath: { getData } } = rv1(routesV1.bookings.cancel$put);
  const payload = getData({ bookingId });
  await api.call(path, { method, data: payload });
};

export default {
  fetchBookingById,
  fetchBookingsAddedAfter,
  fetchBookingsArriveAt,
  fetchBookingsExpiredAndReminded,
  fetchNotPayedBookingsArriveAfter,
  confirmPrepayment,
  confirmLiving,
  createBooking,
  putRemindedPrepayment,
  syncBookings,
  fetchClientBookings,
  moveBookingInBatch,
  moveBooking,
  fetchBookingsArriveAtAndNotLiving,
  cancelBooking
};
