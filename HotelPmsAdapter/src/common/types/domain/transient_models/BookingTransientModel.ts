import { BookingModel } from '~/domain/bookings/BookingModel';
import { ClientTransientModel } from './ClientTransientModel';
import { RoomTransientModel } from './RoomTransientModel';

type BookingTransientModel =
  Omit<BookingModel,
    'client' | 'room' | 'createdAt' | 'updatedAt' | 'carPlates' | 'prepaymentRemindings'>
  & {
  client: ClientTransientModel
  room: RoomTransientModel
};

export type { BookingTransientModel };
