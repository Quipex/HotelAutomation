import { CreateBookingPayload } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models/BookingTransientModel';
import { CloudProvider } from '../CloudProvider.interface';
import {
  createBooking as easymsCreateBooking,
  fetchBookingsByDates as easymsFetchBookingsByDates,
  markBookingAsLiving as easymsMarkBookingAsLiving,
  cancelBooking as easymsCancelBooking
} from './features';

const EasymsCloudProvider: CloudProvider = {
  cancelBooking(bookingId: string): Promise<void> {
    return easymsCancelBooking(bookingId);
  },
  createBooking(payload: CreateBookingPayload): Promise<{ id: string }> {
    return easymsCreateBooking(payload);
  },
  fetchBookingsByDates(startDate: Date, endDate: Date): Promise<BookingTransientModel[]> {
    return easymsFetchBookingsByDates(startDate, endDate);
  },
  markBookingAsCheckedIn(bookingId: string): Promise<void> {
    return easymsMarkBookingAsLiving(bookingId);
  },
  markBookingAsPrepaid(): Promise<void> {
    return Promise.resolve();
  }
};

export { EasymsCloudProvider };
