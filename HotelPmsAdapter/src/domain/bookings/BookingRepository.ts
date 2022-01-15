import {
  getRepository, In, LessThan, MoreThan
} from 'typeorm';
import { formatDate, subtractFromDate } from '~/common/utils/dates';
import { PmsClientEntity } from '../clients/ClientPmsModel';
import { PmsBookingEntity } from './BookingModel';

export const saveBookings = async (bookings: PmsBookingEntity[]): Promise<PmsBookingEntity[]> => {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.save(bookings);
};

export const findAllBookings = async (): Promise<PmsBookingEntity[]> => {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.find();
};

export const findArrivalsAt = async (startDate: Date): Promise<PmsBookingEntity[]> => {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.find({
    where: {
      startDate,
      status: In(['LIVING', 'BOOKING_FREE', 'BOOKING_WARRANTY']),
      moved: false
    },
    order: {
      realRoomNumber: 'ASC'
    }
  });
};

export const findBookingsAddedAfter = async (date: Date): Promise<PmsBookingEntity[]> => {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.find({
    where: {
      addedDate: MoreThan(formatDate(date)),
      moved: false
    },
    order: {
      startDate: 'ASC',
      realRoomNumber: 'ASC'
    }
  });
};

export async function findById(id: string): Promise<PmsBookingEntity | undefined> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.findOne(id);
}

export async function findBookingsNotPayedArriveAfter(date: Date): Promise<PmsBookingEntity[]> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.find({
    where: {
      startDate: MoreThan(formatDate(date)),
      status: 'BOOKING_FREE',
      moved: false
    },
    order: {
      startDate: 'ASC',
      realRoomNumber: 'ASC'
    }
  });
}

export async function setBookingToConfirmed(id: number): Promise<void> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  await bookingsRepository.update({ id }, { status: 'BOOKING_WARRANTY' });
}

export async function setBookingToLiving(id: number): Promise<void> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  await bookingsRepository.update({ id }, { status: 'LIVING' });
}

export async function setBookingPrepaymentWasReminded(id: number): Promise<void> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  await bookingsRepository.update({ id }, { remindedPrepayment: new Date() });
}

export async function findBookingsWhoRemindedAndExpired(): Promise<PmsBookingEntity[]> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.find({
    where: {
      remindedPrepayment: LessThan(subtractFromDate({ amount: 24, unit: 'hours' })),
      status: 'BOOKING_FREE',
      moved: false
    },
    order: {
      startDate: 'ASC',
      realRoomNumber: 'ASC'
    }
  });
}

export async function findBookingsByOwner(clientId: number): Promise<PmsClientEntity[]> {
  const bookingsRepository = getRepository(PmsBookingEntity);
  return bookingsRepository.find({
    where: {
      customerId: clientId,
      moved: false
    },
    order: {
      startDate: 'ASC',
      realRoomNumber: 'ASC'
    }
  });
}
