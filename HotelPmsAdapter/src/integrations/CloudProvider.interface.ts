import { CreateBookingPayload } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models/BookingTransientModel';
import { ClientTransientModel } from '~/common/types/domain/transient_models/ClientTransientModel';

type CloudProvider = {
  createBooking: (payload: CreateBookingPayload) => Promise<{ id: string }>;
  fetchBookingsByDates: (startDate: Date, endDate: Date) => Promise<BookingTransientModel[]>;
  fetchClientsByName: (name: string) => Promise<ClientTransientModel[]>;
  markBookingAsCheckedIn: (bookingId: string) => Promise<boolean>;
  markBookingAsPrepaid: (bookingId: string) => Promise<boolean>;
};

export type {
  CloudProvider
};
