import { mapBookingModel2dto } from '~/common/mappings/dto';
import { transientBookings2bookingModels, transientClient2clientModel } from '~/common/mappings/transient';
import { BookingDto, CreateBookingPayload } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models';
import { BookingId, BookingModel } from '~/domain/bookings/BookingModel';
import { getRepository } from '~/domain/helpers/orm';
import { RoomModel } from '~/domain/rooms/RoomModel';
import { getCloudProvider } from '~/integrations/getCloudProvider';
import BookingRepository from './BookingRepository';

const saveTransientBookingsAndIncludedClients = async (
  transientBookings: BookingTransientModel[]
): Promise<BookingDto[]> => {
  const savedRooms = await getRepository(RoomModel).find();
  const clientModels = transientBookings.map(({ client }) => transientClient2clientModel(client));
  const bookingsToSave = transientBookings2bookingModels({ transientBookings, clientModels, savedRooms });
  const dirtySavedBookings = await getRepository(BookingModel).save(bookingsToSave);
  const savedBookingIds = dirtySavedBookings.map((b) => b.id);
  const savedBookingModels = await BookingRepository.findByIds(savedBookingIds);
  return savedBookingModels.map(mapBookingModel2dto);
};

const fetchPmsAndGetAllActiveBookings = async (): Promise<BookingDto[]> => {
  const todayYear = new Date().getFullYear();
  const startDate = new Date(todayYear, 5, 1);
  const endDate = new Date(todayYear, 8, 30);

  const transientBookings = await getCloudProvider().fetchBookingsByDates(startDate, endDate);
  const savedBookings = await saveTransientBookingsAndIncludedClients(transientBookings);
  return savedBookings.filter((b) => !b.cancelled);
};

const getAllBookings = async (): Promise<BookingDto[]> => {
  const bookingModels = await BookingRepository.findAllBookings();
  return bookingModels.map(mapBookingModel2dto);
};

const getArrivalsBy = async (utcDate: string): Promise<BookingDto[]> => {
  const bookingModels = await BookingRepository.findArrivalsAt(new Date(utcDate));
  return bookingModels.map(mapBookingModel2dto);
};

const getBookingsAddedAfter = async (utcDate: string): Promise<BookingDto[]> => {
  const bookingModels = await BookingRepository.findAddedAfter(new Date(utcDate));
  return bookingModels.map(mapBookingModel2dto);
};

const getBookingById = async (id: string): Promise<BookingDto | null> => {
  const bookingModel = await BookingRepository.findById(id);
  return bookingModel ? mapBookingModel2dto(bookingModel) : null;
};

const getBookingsNotPayedArriveAfter = async (utcDate: string): Promise<BookingDto[]> => {
  const bookingModels = await BookingRepository.findNotPaidArriveAfter(new Date(utcDate));
  return bookingModels.map(mapBookingModel2dto);
};

const confirmPrepayment = async (bookingId: string): Promise<void> => {
  await getCloudProvider().markBookingAsPrepaid(bookingId);
  await BookingRepository.markAsPrepaid(bookingId);
};

const confirmLiving = async (bookingId: string): Promise<void> => {
  const booking = await BookingRepository.findById(bookingId);
  if (!booking.prepaid) {
    await confirmPrepayment(bookingId);
  }

  await getCloudProvider().markBookingAsCheckedIn(bookingId);
  await BookingRepository.markAsLiving(bookingId);
};

const remindedOfPrepayment = async (bookingId: string): Promise<void> => {
  await BookingRepository.registerNewPrepaymentReminding(bookingId);
};

const expiredRemindedPrepayment = async (): Promise<BookingDto[]> => {
  return (await BookingRepository.findRemindedAndExpired())
    .map(mapBookingModel2dto);
};

const getBookingsByOwner = async (clientId: string): Promise<BookingDto[]> => {
  return (await BookingRepository.findByOwner(clientId))
    .map(mapBookingModel2dto);
};

/**
 * @throws {BookingCreationConflictError} on conflicting bookings
 */
const createBookingAndSyncBookings = async (payload: CreateBookingPayload): Promise<BookingId> => {
  const resp = await getCloudProvider().createBooking(payload);
  // todo: replace with the response from api call persisted to db
  await fetchPmsAndGetAllActiveBookings();
  return resp.id;
};

const cancelBooking = async (bookingId: string) => {
  await getCloudProvider().cancelBooking(bookingId);
  await BookingRepository.cancelBooking(bookingId);
};

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
  createBookingAndSyncBookings,
  cancelBooking
};

export type {
  CreateBookingPayload
};
