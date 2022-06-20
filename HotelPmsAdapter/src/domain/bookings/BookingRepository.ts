import { In, Raw } from 'typeorm';
import { SOURCES_MANUAL_CREATION } from '~/common/constants';
import { formatDate, subtractFromDate } from '~/common/utils/dates';
import { CarPlateModel } from '~/domain/car_plates/CarPlateModel';
import { ClientId } from '~/domain/clients/ClientModel';
import { PrepaymentRemindingsModel } from '~/domain/prepayment_remindings/PrepaymentRemindingsModel';
import { getRepository, lessThanDate, lessThanOrEqualDate, moreThanDate, moreThanOrEqualDate } from '../helpers/orm';
import { BookingId, BookingModel } from './BookingModel';

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
    ...(!includingCancelled && { cancelled: false })
  };
};

const findArrivalsAt = async (startDate: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: getConditionForArrivesAt(startDate, includingCancelled),
    order: {
      room: { realRoomNumber: 'ASC' }
    }
  });
};

const findAddedAfter = async (date: Date): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      createdAt: moreThanOrEqualDate(date)
    },
    order: {
      startDate: 'ASC',
      room: { realRoomNumber: 'ASC' }
    }
  });
};

const findById = async (id: BookingId): Promise<BookingModel | null> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.findOneBy({ id });
};

const findNotPaidArriveAfter = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      startDate: moreThanDate(date),
      prepaid: false,
      ...(!includingCancelled && { cancelled: false })
    },
    order: {
      startDate: 'ASC',
      room: { realRoomNumber: 'ASC' }
    }
  });
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

const findRemindedAndExpired = async (): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  const date24hoursAgo = subtractFromDate({ amount: 24, unit: 'hours' }).toDate();
  return bookingsRepository.find({
    where: {
      prepaymentRemindings: { createdAt: lessThanDate(date24hoursAgo) },
      prepaid: false
    },
    order: {
      startDate: 'ASC',
      room: { realRoomNumber: 'ASC' }
    }
  });
};

const findByOwner = async (clientId: ClientId): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      client: {
        id: clientId
      }
    },
    order: {
      startDate: 'ASC',
      room: { realRoomNumber: 'ASC' }
    }
  });
};

const cancelBooking = async (bookingId: string) => {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id: bookingId }, { cancelled: true });
};

const countArrivalsAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.count({
    where: {
      startDate: date,
      ...(!includingCancelled && { cancelled: false })
    }
  });
};

const countDeparturesAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.count({
    where: {
      endDateExclusive: date,
      ...(!includingCancelled && { cancelled: false })
    }
  });
};

const countLivingAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.count({
    where: {
      startDate: lessThanDate(date),
      endDateExclusive: moreThanDate(date),
      ...(!includingCancelled && { cancelled: false })
    }
  });
};

/**
 * 'Cars' is sum of arrivals & living that have cars
 */
const countCarsAtDate = async (date: Date, includingCancelled = false): Promise<number> => {
  const carPlateRepository = getRepository(CarPlateModel);
  return carPlateRepository.count({
    where: {
      booking: {
        startDate: lessThanOrEqualDate(date),
        endDateExclusive: moreThanDate(date),
        ...(!includingCancelled && { cancelled: false })
      }
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
  return bookingsRepository.count({
    where: {
      createdAt: Raw((alias) => `CAST(${alias} as date) = :ourDate`, { ourDate: formatDate(date) }),
      ...(!includingCancelled && { cancelled: false }),
      ...(manuallyCreated && { source: In(SOURCES_MANUAL_CREATION) })
    }
  });
};

const livingButNotMarkedClause = (date: Date, includingCancelled: boolean) => ({
  living: false,
  startDate: lessThanOrEqualDate(date),
  endDateExclusive: moreThanDate(date),
  ...(!includingCancelled && { cancelled: false })
});

const findLivingButNotMarked = async (date: Date, includingCancelled = false): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: livingButNotMarkedClause(date, includingCancelled)
  });
};

const countLivingButNotMarked = async (date: Date, includingCancelled = false): Promise<number> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.countBy(livingButNotMarkedClause(date, includingCancelled));
};

export default {
  findAllBookings,
  findArrivalsAt,
  findAddedAfter,
  findById,
  findNotPaidArriveAfter,
  findRemindedAndExpired,
  findByOwner,
  findByIds,
  markAsPrepaid,
  markAsLiving,
  registerNewPrepaymentReminding,
  cancelBooking,
  countArrivalsAtDate,
  countDeparturesAtDate,
  countLivingAtDate,
  countCarsAtDate,
  countAddedOn,
  countLivingButNotMarked,
  findLivingButNotMarked
};
