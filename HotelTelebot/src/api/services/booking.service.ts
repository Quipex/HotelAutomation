import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { BookingDto } from '~/common/types';
import { BookingCreationPayload } from '~/common/types/routes.v1.types';
import { log } from '~/config/logger';
import { rv1 } from './helpers';

const {
  byId$get,
  added$get,
  arrive$get,
  owner,
  create$put,
  sync$put,
  confirmLiving$put,
  confirmPrepayment$put,
  remindedPrepayment$put,
  notPaid$get,
  cancel$put,
  livingNotMarked$get,
  setNote$patch,
  note$get
} = routesV1.bookings;

const fetchBookingById = async (bookingId: string) => {
  const {
    path: fullPath, method, compactPath: { withPathVariable }
  } = rv1(byId$get);
  const path = withPathVariable(fullPath, bookingId);
  return await api.call(path, { method }) as BookingDto;
};

const fetchBookingsAddedAfter = async (utcDate: string) => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(added$get);
  const params = getQueryParams({ after: utcDate });
  return await api.call(path, { method, params }) as BookingDto[];
};

const fetchBookingsArriveAt = async (utcDate: string) => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(arrive$get);
  const params = getQueryParams({ on: utcDate });
  return await api.call(path, { method, params }) as BookingDto[];
};

const fetchNotPayedBookingsArriveAfter = async (utcDate: string, wereReminded?: boolean, expired?: boolean) => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(notPaid$get);
  const params = getQueryParams({ arrive_after: utcDate, expired, wereReminded });
  return await api.call(path, { method, params }) as BookingDto[];
};

const confirmPrepayment = async (bookingId: string): Promise<void> => {
  const {
    path, method, compactPath: { getData }
  } = rv1(confirmPrepayment$put);
  const data = getData({ bookingId });
  await api.call(path, { data, method });
};

const confirmLiving = async (bookingId: string) => {
  const {
    path, method, compactPath: { getData }
  } = rv1(confirmLiving$put);
  const data = getData({ bookingId });
  return api.call(path, { data, method });
};

const createBooking = async (createPayload: BookingCreationPayload) => {
  const {
    path, method, compactPath: { getData }
  } = rv1(create$put);
  const data = getData(createPayload);
  return api.call(path, { data, method });
};

const putRemindedPrepayment = async (bookingId: string) => {
  const {
    path, method, compactPath: { getData }
  } = rv1(remindedPrepayment$put);
  const data = getData({ bookingId });
  await api.call(path, { data, method });
};

const syncBookings = async () => {
  const {
    path, method
  } = rv1(sync$put);
  await api.call(path, { method });
};

const fetchClientBookings = async (clientId: string) => {
  const {
    path: fullPath, method, compactPath: { withPathVariable }
  } = rv1(owner.byId$get);
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

const fetchLivingButNotMarked = async (date: string): Promise<BookingDto[]> => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(livingNotMarked$get);
  const params = getQueryParams({ date });
  return await api.call(path, { method, params }) as BookingDto[];
};

const cancelBooking = async (bookingId: string) => {
  const {
    path, method, compactPath: { getData }
  } = rv1(cancel$put);
  const payload = getData({ bookingId });
  await api.call(path, { method, data: payload });
};

const setNote = async (bookingId: string, noteText: string) => {
  const { path, method, compactPath: { getData } } = rv1(setNote$patch);
  const data = getData({ id: bookingId, noteText });
  await api.call(path, { method, data });
};

const getNote = async (bookingId: string) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(note$get);
  const params = getQueryParams({ id: bookingId });
  return (await api.call(path, { method, params })) as { notes: string };
};

export default {
  fetchBookingById,
  fetchBookingsAddedAfter,
  fetchBookingsArriveAt,
  fetchNotPayedBookingsArriveAfter,
  confirmPrepayment,
  confirmLiving,
  createBooking,
  putRemindedPrepayment,
  syncBookings,
  fetchClientBookings,
  moveBookingInBatch,
  moveBooking,
  fetchLivingButNotMarked,
  cancelBooking,
  setNote,
  getNote
};
