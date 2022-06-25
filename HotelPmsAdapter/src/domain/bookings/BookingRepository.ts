import { FindOptionsOrder, FindOptionsWhere, In, Raw } from 'typeorm';
import { SOURCES_MANUAL_CREATION } from '~/common/constants';
import { formatDate, subtractFromDate } from '~/common/utils/dates';
import appConfig from '~/config/appConfig';
import { CarPlateModel } from '~/domain/car_plates/CarPlateModel';
import { ClientId } from '~/domain/clients/ClientModel';
import { PrepaymentRemindingsModel } from '~/domain/prepayment_remindings/PrepaymentRemindingsModel';
import { getRepository, lessThanDate, lessThanOrEqualDate, moreThanDate, moreThanOrEqualDate } from '../helpers/orm';
import { BookingId, BookingModel } from './BookingModel';

const closestFirstRoomsAsc: FindOptionsOrder<BookingModel> = {
  startDate: 'ASC',
  room: { realRoomNumber: 'ASC' }
};

const getIncludingCancelledClause = (includingCancelled: boolean) => ({
  ...(!includingCancelled && { cancelled: false })
});

const findAllBookings = async (): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find();
};

const findByIds = async (ids: string[]): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.findBy({ id: In(ids) });
};

const getConditionForArrivesAt = (startDate: Date, includingCancelled: boolean) => {
  return {
    startDate,
    ...getIncludingCancelledClause(includingCancelled)
  };
};

const findArrivalsAtDate = async (startDate: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: getConditionForArrivesAt(startDate, includingCancelled),
    order: closestFirstRoomsAsc
  });
};

const countArrivalsAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy(getConditionForArrivesAt(date, includingCancelled));
};

const findAddedAfter = async (date: Date): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      createdAt: moreThanOrEqualDate(date)
    },
    order: closestFirstRoomsAsc
  });
};

const findById = async (id: BookingId): Promise<BookingModel | null> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.findOneBy({ id });
};

const getNotPaidArriveAfterClause = (date: Date, includingCancelled: boolean): FindOptionsWhere<BookingModel> => ({
  startDate: moreThanDate(date),
  prepaid: false,
  ...getIncludingCancelledClause(includingCancelled)
});

const findNotPaidArriveAfter = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);

  return bookingsRepository.find({
    where: getNotPaidArriveAfterClause(date, includingCancelled),
    order: closestFirstRoomsAsc
  });
};

const countNotPaidArriveAfter = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy(getNotPaidArriveAfterClause(date, includingCancelled));
};

const markAsPrepaid = async (id: BookingId): Promise<void> => {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id }, { prepaid: true });
};

const markAsLiving = async (id: BookingId): Promise<void> => {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id }, { living: true });
};

const registerNewPrepaymentReminding = async (id: BookingId): Promise<void> => {
  const bookingsRepository = getRepository(BookingModel);
  const foundBooking = await bookingsRepository.findOneBy({ id });
  foundBooking.prepaymentRemindings.push(new PrepaymentRemindingsModel());
  await bookingsRepository.save(foundBooking);
};

const getRemindedAndExpiredClause = async (date: Date, includingCancelled: boolean):
  Promise<FindOptionsWhere<BookingModel>> => {
  await appConfig.read();
  const date24hoursAgo = subtractFromDate(
    { date, amount: appConfig.data.clientPrepaymentHours, unit: 'hours' }
  ).toDate();
  return {
    prepaymentRemindings: { createdAt: lessThanDate(date24hoursAgo) },
    prepaid: false,
    ...getIncludingCancelledClause(includingCancelled)
  };
};

const findRemindedAndExpired = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: await getRemindedAndExpiredClause(date, includingCancelled),
    order: closestFirstRoomsAsc
  });
};

const countRemindedAndExpired = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy(await getRemindedAndExpiredClause(date, includingCancelled));
};

const getRemindedNotExpiredClause = async (date: Date, includingCancelled: boolean):
  Promise<FindOptionsWhere<BookingModel>> => {
  await appConfig.read();
  const date24hoursAgo = subtractFromDate({
    date,
    amount: appConfig.data.clientPrepaymentHours,
    unit: 'hours'
  }).toDate();
  return {
    prepaymentRemindings: { createdAt: moreThanOrEqualDate(date24hoursAgo) },
    prepaid: false,
    ...getIncludingCancelledClause(includingCancelled)
  };
};

const findRemindedNotExpired = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: await getRemindedNotExpiredClause(date, includingCancelled),
    order: closestFirstRoomsAsc
  });
};

const countRemindedNotExpired = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy(await getRemindedNotExpiredClause(date, includingCancelled));
};

const findByOwner = async (clientId: ClientId): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      client: {
        id: clientId
      }
    },
    order: closestFirstRoomsAsc
  });
};

const cancelBooking = async (bookingId: string) => {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id: bookingId }, { cancelled: true });
};

const countDeparturesAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy({
    endDateExclusive: date,
    ...getIncludingCancelledClause(includingCancelled)
  });
};

const countLivingAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy({
    startDate: lessThanDate(date),
    endDateExclusive: moreThanDate(date),
    ...getIncludingCancelledClause(includingCancelled)
  });
};

/**
 * 'Cars' is sum of arrivals & living that have cars
 */
const countCarsAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const carPlateRepository = getRepository(CarPlateModel);
  return carPlateRepository.countBy({
    booking: {
      startDate: lessThanOrEqualDate(date),
      endDateExclusive: moreThanDate(date),
      ...getIncludingCancelledClause(includingCancelled)
    }
  });
};

type NewBookingsAtDateArgs = {
  date: Date,
  manuallyCreated: boolean,
  includingCancelled?: boolean
};

const countAddedOn = async (
  { date, manuallyCreated, includingCancelled = false }: NewBookingsAtDateArgs
): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy({
    createdAt: Raw((alias) => `CAST(${alias} as date) = :ourDate`, { ourDate: formatDate(date) }),
    ...getIncludingCancelledClause(includingCancelled),
    ...(manuallyCreated && { source: In(SOURCES_MANUAL_CREATION) })
  });
};

const getClauseLivingButNotMarked = (date: Date, includingCancelled: boolean): FindOptionsWhere<BookingModel> => ({
  living: false,
  startDate: lessThanOrEqualDate(date),
  endDateExclusive: moreThanDate(date),
  ...getIncludingCancelledClause(includingCancelled)
});

const findLivingButNotMarked = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: getClauseLivingButNotMarked(date, includingCancelled)
  });
};

const countLivingButNotMarked = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy(getClauseLivingButNotMarked(date, includingCancelled));
};

const countNotRemindedNoPrepaid = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingModels = await findNotRemindedNoPrepaid(date, includingCancelled);
  return bookingModels.length;
};

const findNotRemindedNoPrepaid = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  // :( too bad orm doesn't allow me to customize the query
  const notPrepaid = await findNotPaidArriveAfter(date, includingCancelled);
  return notPrepaid.filter((np) => np.prepaymentRemindings.length === 0);
};

const setNote = async (bookingId: string, textNote: string) => {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id: bookingId }, { notes: textNote });
};

const getNote = async (bookingId: string) => {
  const bookingsRepository = getRepository(BookingModel);
  const { notes } = await bookingsRepository.findOne({
    where: { id: bookingId },
    select: ['id', 'notes']
  });
  return { notes };
};

export default {
  findAllBookings,
  findAddedAfter,
  findById,
  findByOwner,
  findByIds,
  markAsPrepaid,
  markAsLiving,
  registerNewPrepaymentReminding,
  cancelBooking,
  findArrivalsAtDate,
  countArrivalsAtDate,
  countDeparturesAtDate,
  countLivingAtDate,
  countCarsAtDate,
  countAddedOn,
  findLivingButNotMarked,
  countLivingButNotMarked,
  findNotPaidArriveAfter,
  countNotPaidArriveAfter,
  findNotRemindedNoPrepaid,
  countNotRemindedNoPrepaid,
  findRemindedNotExpired,
  countRemindedNotExpired,
  findRemindedAndExpired,
  countRemindedAndExpired,
  setNote,
  getNote
};
