import BriefBooking from '~/app/message_components/booking/BriefBooking';
import { BookingDto } from '~/common/types';

function ColorfulBooking(
  booking: BookingDto
): string {
  return BriefBooking(booking, true);
}

export default ColorfulBooking;
