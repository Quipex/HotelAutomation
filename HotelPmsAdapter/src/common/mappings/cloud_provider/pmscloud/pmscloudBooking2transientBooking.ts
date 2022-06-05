import { BookingPmscloud } from '~/common/types/cloud_provider';
import { PmscloudBookingStatus } from '~/common/types/cloud_provider/pmscloud';
import { BookingTransientModel } from '~/common/types/domain/transient_models';
import { unixSecondsToDate } from '~/common/utils/dates';

const mapPmscloudBooking2TransientBooking = (bookingPmscloud: BookingPmscloud): BookingTransientModel => {
  const {
    id,
    source,
    cdsTotal,
    startDate,
    endDate,
    groupId,
    status,
    roomId,
    cdsCustomerFirstName: firstName,
    cdsCustomerLastName: lastName,
    cdsCustomerId
  } = bookingPmscloud;

  const cancelled = status === PmscloudBookingStatus.REFUSE || status === PmscloudBookingStatus.NOT_ARRIVED;
  const living = status === PmscloudBookingStatus.LIVING;
  const prepaid = status === PmscloudBookingStatus.BOOKING_WARRANTY;

  return {
    id: id.toString(),
    source,
    totalUahCoins: (cdsTotal * 100).toString(),
    startDate: unixSecondsToDate(startDate),
    endDateExclusive: unixSecondsToDate(endDate),
    groupId: groupId.toString(),
    bookedAt: new Date(),
    cancelled,
    living,
    prepaid,
    room: { pmscloudRoomId: roomId },
    client: {
      id: cdsCustomerId.toString(),
      firstName,
      lastName
    }
  };
};

export { mapPmscloudBooking2TransientBooking };
