import BriefBooking from '~/app/message_components/booking/BriefBooking';
import { BookingDto } from '~/common/types';

function PlainTextBooking(booking: BookingDto): string {
  return BriefBooking(booking, false);
}

export default PlainTextBooking;
