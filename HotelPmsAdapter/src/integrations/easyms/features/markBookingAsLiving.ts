import { EasymsReservationStatus } from '~/common/types/cloud_provider/easyms';
import { CloudProvider } from '~/integrations/CloudProvider.interface';
import { modifyBooking } from './helpers';

const setBookingCheckedIn = (order, bookingId) => {
  const roomToCheckIn = order.rooms.find((r) => r.roomReservationId === bookingId);
  roomToCheckIn.status = EasymsReservationStatus.CHECKED_IN;
  return order;
};

const markBookingAsLiving: CloudProvider['markBookingAsPrepaid'] = async (bookingId) => {
  await modifyBooking(bookingId, setBookingCheckedIn);
};

export { markBookingAsLiving };
