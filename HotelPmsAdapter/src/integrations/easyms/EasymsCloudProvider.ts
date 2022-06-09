import { CreateBookingPayload } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models/BookingTransientModel';
import { log } from '~/config/logger';
import { CloudProvider } from '../CloudProvider.interface';
import { createBooking as easymsCreateBooking, fetchBookingsByDates as easymsFetchBookingsByDates } from './features';

const EasymsCloudProvider: CloudProvider = {
  createBooking(payload: CreateBookingPayload): Promise<{ id: string }> {
    return easymsCreateBooking(payload);
  },
  fetchBookingsByDates(startDate: Date, endDate: Date): Promise<BookingTransientModel[]> {
    return easymsFetchBookingsByDates(startDate, endDate);
  },
  markBookingAsCheckedIn(bookingId: string): Promise<boolean> {
    log.error('Not implemented', { args: [bookingId] });
    throw new Error('Not implemented yet');
  },
  markBookingAsPrepaid(bookingId: string): Promise<boolean> {
    log.error('Not implemented', { args: [bookingId] });
    throw new Error('Not implemented yet');
  }
};

export { EasymsCloudProvider };
