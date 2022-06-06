import { CreateBookingPayload } from '~/common/types';
import { BookingTransientModel, ClientTransientModel } from '~/common/types/domain/transient_models';

type CloudProvider = {
  /**
   * @throws {BookingCreationConflictError} on conflicting bookings
   */
  createBooking: (payload: CreateBookingPayload) => Promise<{ id: string }>;
  fetchBookingsByDates: (startDate: Date, endDate: Date) => Promise<BookingTransientModel[]>;
  fetchClientsByName: (name: string) => Promise<ClientTransientModel[]>;
  markBookingAsCheckedIn: (bookingId: string) => Promise<boolean>;
  markBookingAsPrepaid: (bookingId: string) => Promise<boolean>;
};

export type {
  CloudProvider
};
