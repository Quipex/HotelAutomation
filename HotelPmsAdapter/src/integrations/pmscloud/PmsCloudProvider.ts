import { CreateBookingPayload } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models/BookingTransientModel';
import { CloudProvider } from '../CloudProvider.interface';
import {
  createBooking as pmsCloudCreateBooking,
  fetchBookingsByDates as pmsCloudFetchBookingsByDates,
  markBookingAsCheckedIn as pmsCloudMarkBookingAsCheckedIn,
  markBookingAsPrepaid as pmsCloudMarkBookingAsPrepaid
} from './features';

const PmsCloudProvider: CloudProvider = {
  cancelBooking(): Promise<void> {
    throw new Error('Not implemented');
  },
  createBooking(payload: CreateBookingPayload): Promise<{ id: string; }> {
    return pmsCloudCreateBooking(payload);
  },
  fetchBookingsByDates(startDate: Date, endDate: Date): Promise<BookingTransientModel[]> {
    return pmsCloudFetchBookingsByDates(startDate, endDate);
  },
  markBookingAsCheckedIn(bookingId: string): Promise<void> {
    return pmsCloudMarkBookingAsCheckedIn(bookingId);
  },
  markBookingAsPrepaid(bookingId: string): Promise<void> {
    return pmsCloudMarkBookingAsPrepaid(bookingId);
  }
};

export { PmsCloudProvider };
