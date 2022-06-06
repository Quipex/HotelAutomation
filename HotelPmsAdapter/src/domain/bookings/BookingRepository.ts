import { In } from 'typeorm';
import { subtractFromDate } from '~/common/utils/dates';
import { ClientId } from '~/domain/clients/ClientModel';
import { PrepaymentRemindingsModel } from '~/domain/prepayment_remindings/PrepaymentRemindingsModel';
import { getRepository, lessThanDate, moreThanDate } from '../helpers/orm';
import { BookingId, BookingModel } from './BookingModel';

const findAllBookings = async (): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find();
};

const findBookingsByIds = async (ids: string[]): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.findBy({ id: In(ids) });
};

const findArrivalsAt = async (startDate: Date): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      startDate,
      cancelled: false
    },
    order: {
      room: { realRoomNumber: 'ASC' }
    }
  });
};

const findBookingsAddedAfter = async (date: Date): Promise<BookingModel[]> => {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      createdAt: moreThanDate(date)
    },
    order: {
      startDate: 'ASC',
      room: { realRoomNumber: 'ASC' }
    }
  });
};

async function findById(id: BookingId): Promise<BookingModel | null> {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.findOneBy({ id });
}

async function findBookingsNotPayedArriveAfter(date: Date): Promise<BookingModel[]> {
  const bookingsRepository = getRepository(BookingModel);
  return bookingsRepository.find({
    where: {
      startDate: moreThanDate(date),
      cancelled: false,
      prepaid: false
    },
    order: {
      startDate: 'ASC',
      room: { realRoomNumber: 'ASC' }
    }
  });
}

async function setBookingToConfirmed(id: BookingId): Promise<void> {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id }, { prepaid: true });
}

async function setBookingToLiving(id: BookingId): Promise<void> {
  const bookingsRepository = getRepository(BookingModel);
  await bookingsRepository.update({ id }, { living: true });
}

async function setBookingPrepaymentWasReminded(id: BookingId): Promise<void> {
  const bookingsRepository = getRepository(BookingModel);
  const foundBooking = await bookingsRepository.findOneBy({ id });
  foundBooking.prepaymentRemindings.push(new PrepaymentRemindingsModel());
  await bookingsRepository.save(foundBooking);
}

async function findBookingsWhoRemindedAndExpired(): Promise<BookingModel[]> {
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
}

async function findBookingsByOwner(clientId: ClientId): Promise<BookingModel[]> {
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
}

export {
  findAllBookings,
  findArrivalsAt,
  findBookingsAddedAfter,
  findById,
  findBookingsNotPayedArriveAfter,
  setBookingToConfirmed,
  setBookingToLiving,
  setBookingPrepaymentWasReminded,
  findBookingsWhoRemindedAndExpired,
  findBookingsByOwner,
  findBookingsByIds
};
