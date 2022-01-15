import { encodeObjectAsUrl } from 'src/common/utils/url/encodeObjectAsUrl';
import { dateToUnixSeconds, unixDateToDate } from '~/common/utils/dates';
import api from '~/pms_cloud/api';
import { getRoom } from '~/pms_cloud/room_constants';
import { getRoomCategory } from '~/pms_cloud/room_categories_constants';
import createBookingPayload from '~/pms_cloud/create_booking';
import { and, SearchFilter, SearchParam } from '~/pms_cloud/search';
import { PmsClientEntity } from '../clients/ClientPmsModel';
import { mapPmsBookingsToEntities, PmsBooking, PmsBookingEntity } from './BookingModel';
import {
  findAllBookings,
  findArrivalsAt,
  findBookingsAddedAfter,
  findBookingsByOwner,
  findBookingsNotPayedArriveAfter,
  findBookingsWhoRemindedAndExpired,
  findById,
  saveBookings,
  setBookingPrepaymentWasReminded,
  setBookingToConfirmed,
  setBookingToLiving
} from './BookingRepository';
import { CreateBookingPayload } from './common/create_booking_payload.type';

function datesFilters(startTime: number, endTime: number): SearchParam[] {
  return [
    {
      field: 'startDate',
      comparison: 'lte',
      type: 'date',
      // this is not a mistake, we invert dates on purpose
      value: String(endTime)
    },
    {
      field: 'endDate',
      comparison: 'gte',
      type: 'date',
      // this is not a mistake, we invert dates on purpose
      value: String(startTime)
    }
  ];
}

function composeBookingsUrlWithFilter(filter: SearchFilter) {
  const urlEncodedFilter = encodeObjectAsUrl(filter);
  return `/frontDesk?_dc=${Date.now()}&withFilter=${urlEncodedFilter}&ajax_request=true`;
}

const todayYear = new Date().getFullYear();
const startTime = Date.UTC(todayYear, 5, 1) / 1000;
const endTime = Date.UTC(todayYear, 8, 30) / 1000;

async function fetchPmsAndGetAllBookings(): Promise<PmsBooking[]> {
  const bookingsByDatesPath = composeBookingsUrlWithFilter(and(...datesFilters(startTime, endTime)));
  const pmsBookings = (await api.get(bookingsByDatesPath, { extra: { limit: 100 } })) as PmsBooking[];
  const pmsBookingsWithRooms = pmsBookings.map((b) => ({
    ...b,
    realRoomNumber: getRoom(b.roomId),
    realRoomType: getRoomCategory(b.roomTypeId)
  }));
  const pmsBookingEntities = pmsBookingsWithRooms.map(mapPmsBookingsToEntities);

  await saveBookings(pmsBookingEntities);

  return pmsBookingsWithRooms.filter((b) => (b.status !== 'REFUSE' && b.status !== 'NOT_ARRIVED'));
}

async function getAllBookings(): Promise<PmsBookingEntity[]> {
  return findAllBookings();
}

async function getArrivalsBy(unixDate: number): Promise<PmsBookingEntity[]> {
  return findArrivalsAt(unixDateToDate(unixDate));
}

async function getBookingsAddedAfter(unixSeconds: number): Promise<PmsBookingEntity[]> {
  return findBookingsAddedAfter(unixDateToDate(unixSeconds));
}

async function getBookingById(id: string): Promise<PmsBookingEntity | undefined> {
  return findById(id);
}

async function getBookingsNotPayedArriveAfter(unixDate: number): Promise<PmsBookingEntity[]> {
  return findBookingsNotPayedArriveAfter(unixDateToDate(unixDate));
}

async function confirmPrepayment(bookingId: string): Promise<void> {
  await api.post(`/roomUse/${bookingId}/confirmed`);
  await setBookingToConfirmed(+bookingId);
}

async function confirmLiving(bookingId: string): Promise<void> {
  const booking = await findById(bookingId);
  if (booking?.status === 'BOOKING_FREE') {
    await confirmPrepayment(bookingId);
  }
  await api.post(`/roomUse/${bookingId}/checkedIn`, { data: { time: dateToUnixSeconds(new Date()) } });
  await setBookingToLiving(+bookingId);
}

async function remindedOfPrepayment(bookingId: string): Promise<void> {
  await setBookingPrepaymentWasReminded(+bookingId);
}

async function expiredRemindedPrepayment(): Promise<PmsBookingEntity[]> {
  return findBookingsWhoRemindedAndExpired();
}

async function getBookingsByOwner(clientId: string): Promise<PmsClientEntity[]> {
  return findBookingsByOwner(+clientId);
}

async function createBooking(payload: CreateBookingPayload) {
  const apiPayload = createBookingPayload(payload);
  const respContent = await api.post('roomUse', { data: apiPayload });
  // todo: replace with the response from api call persisted to db
  await fetchPmsAndGetAllBookings();
  return (respContent as any).id;
}

export default {
  fetchPmsAndGetAllBookings,
  getAllBookings,
  getArrivalsBy,
  getBookingsAddedAfter,
  getBookingById,
  getBookingsNotPayedArriveAfter,
  confirmPrepayment,
  confirmLiving,
  remindedOfPrepayment,
  expiredRemindedPrepayment,
  getBookingsByOwner,
  createBooking
};

export type {
  CreateBookingPayload
};
