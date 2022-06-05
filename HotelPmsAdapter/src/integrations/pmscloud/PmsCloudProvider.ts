import { CreateBookingPayload } from '~/common/types';
import { ClientTransientModel } from '~/common/types/domain/transient_models';
import { BookingTransientModel } from '~/common/types/domain/transient_models/BookingTransientModel';
import { CloudProvider } from '../CloudProvider.interface';
import {
  createBooking as pmsCloudCreateBooking,
  fetchBookingsByDates as pmsCloudFetchBookingsByDates,
  fetchClientsByName as pmsCloudFetchClientsByName,
  markBookingAsCheckedIn as pmsCloudMarkBookingAsCheckedIn,
  markBookingAsPrepaid as pmsCloudMarkBookingAsPrepaid
} from './features';

const PmsCloudProvider: CloudProvider = {
  createBooking(payload: CreateBookingPayload): Promise<{ id: string; }> {
    return pmsCloudCreateBooking(payload);
  },
  fetchBookingsByDates(startDate: Date, endDate: Date): Promise<BookingTransientModel[]> {
    return pmsCloudFetchBookingsByDates(startDate, endDate);
  },
  fetchClientsByName(name: string): Promise<ClientTransientModel[]> {
    return pmsCloudFetchClientsByName(name);
  },
  markBookingAsCheckedIn(bookingId: string): Promise<boolean> {
    return pmsCloudMarkBookingAsCheckedIn(bookingId);
  },
  markBookingAsPrepaid(bookingId: string): Promise<boolean> {
    return pmsCloudMarkBookingAsPrepaid(bookingId);
  }
};

export { PmsCloudProvider };
