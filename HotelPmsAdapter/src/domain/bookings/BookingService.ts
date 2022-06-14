import { mapBookingModel2dto } from '~/common/mappings/dto';
import { transientBookings2bookingModels, transientClient2clientModel } from '~/common/mappings/transient';
import { BookingDto, CreateBookingPayload } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models';
import { unixSecondsToDate } from '~/common/utils/dates';
import { BookingId, BookingModel } from '~/domain/bookings/BookingModel';
import { getRepository } from '~/domain/helpers/orm';
import { RoomModel } from '~/domain/rooms/RoomModel';
import { getCloudProvider } from '~/integrations/getCloudProvider';
import * as BookingRepository from './BookingRepository';

async function saveTransientBookingsAndIncludedClients(
  transientBookings: BookingTransientModel[]
): Promise<BookingDto[]> {
  const savedRooms = await getRepository(RoomModel).find();
  const clientModels = transientBookings.map(({ client }) => transientClient2clientModel(client));
  const bookingsToSave = transientBookings2bookingModels({ transientBookings, clientModels, savedRooms });
  const dirtySavedBookings = await getRepository(BookingModel).save(bookingsToSave);
  const savedBookingIds = dirtySavedBookings.map((b) => b.id);
  const savedBookingModels = await BookingRepository.findBookingsByIds(savedBookingIds);
  return savedBookingModels.map(mapBookingModel2dto);
}

async function fetchPmsAndGetAllActiveBookings(): Promise<BookingDto[]> {
  const todayYear = new Date().getFullYear();
  const startDate = new Date(todayYear, 5, 1);
  const endDate = new Date(todayYear, 8, 30);

  const transientBookings = await getCloudProvider().fetchBookingsByDates(startDate, endDate);

  const savedBookings = await saveTransientBookingsAndIncludedClients(transientBookings);

  return savedBookings.filter((b) => !b.cancelled);
}

async function getAllBookings(): Promise<BookingDto[]> {
  return (await BookingRepository.findAllBookings())
    .map(mapBookingModel2dto);
}

async function getArrivalsBy(unixDate: number): Promise<BookingDto[]> {
  return (await BookingRepository.findArrivalsAt(unixSecondsToDate(unixDate)))
    .map(mapBookingModel2dto);
}

async function getBookingsAddedAfter(unixSeconds: number): Promise<BookingDto[]> {
  return (await BookingRepository.findBookingsAddedAfter(unixSecondsToDate(unixSeconds)))
    .map(mapBookingModel2dto);
}

async function getBookingById(id: string): Promise<BookingDto | null> {
  const bookingModel = await BookingRepository.findById(id);
  return bookingModel ? mapBookingModel2dto(bookingModel) : null;
}

async function getBookingsNotPayedArriveAfter(unixDate: number): Promise<BookingDto[]> {
  return (await BookingRepository.findBookingsNotPayedArriveAfter(unixSecondsToDate(unixDate)))
    .map(mapBookingModel2dto);
}

async function confirmPrepayment(bookingId: string): Promise<void> {
  await getCloudProvider().markBookingAsPrepaid(bookingId);
  await BookingRepository.setBookingToConfirmed(bookingId);
}

async function confirmLiving(bookingId: string): Promise<void> {
  const booking = await BookingRepository.findById(bookingId);
  if (!booking.prepaid) {
    await confirmPrepayment(bookingId);
  }

  await getCloudProvider().markBookingAsCheckedIn(bookingId);
  await BookingRepository.setBookingToLiving(bookingId);
}

async function remindedOfPrepayment(bookingId: string): Promise<void> {
  await BookingRepository.setBookingPrepaymentWasReminded(bookingId);
}

async function expiredRemindedPrepayment(): Promise<BookingDto[]> {
  return (await BookingRepository.findBookingsWhoRemindedAndExpired())
    .map(mapBookingModel2dto);
}

async function getBookingsByOwner(clientId: string): Promise<BookingDto[]> {
  return (await BookingRepository.findBookingsByOwner(clientId))
    .map(mapBookingModel2dto);
}

/**
 * @throws {BookingCreationConflictError} on conflicting bookings
 */
async function createBookingAndSyncBookings(payload: CreateBookingPayload): Promise<BookingId> {
  const resp = await getCloudProvider().createBooking(payload);
  // todo: replace with the response from api call persisted to db
  await fetchPmsAndGetAllActiveBookings();
  return resp.id;
}

export default {
  fetchPmsAndGetAllActiveBookings,
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
  createBookingAndSyncBookings
};

export type {
  CreateBookingPayload
};
