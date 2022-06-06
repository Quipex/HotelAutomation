import { CreateBookingPayload } from '~/common/types';
import { formatDate } from '~/common/utils/dates';

class BookingCreationConflictError extends Error {
  constructor(createBookingPayload: CreateBookingPayload) {
    const { to, from, roomNumber } = createBookingPayload;
    super(`Can't create a booking for room ${roomNumber}: ${formatDate(from)}=>${formatDate(to)}`);
    Object.setPrototypeOf(this, BookingCreationConflictError.prototype);
  }
}

export { BookingCreationConflictError };
