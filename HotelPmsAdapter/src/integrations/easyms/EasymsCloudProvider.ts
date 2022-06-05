import { CreateBookingPayload } from '~/common/types';
import { ClientTransientModel } from '~/common/types/domain/transient_models';
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
  fetchClientsByName(name: string): Promise<ClientTransientModel[]> {
    log.error('Not implemented', { args: [name] });
    throw new Error('Not implemented yet');
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
