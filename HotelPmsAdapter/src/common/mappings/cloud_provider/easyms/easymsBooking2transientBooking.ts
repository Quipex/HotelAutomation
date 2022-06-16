import { OrderEasyms } from '~/common/types/cloud_provider';
import { EasymsReservationStatus } from '~/common/types/cloud_provider/easyms';
import { BookingTransientModel } from '~/common/types/domain/transient_models/BookingTransientModel';

const mapEasymsBooking2BookingModel = (easymsBooking: OrderEasyms): BookingTransientModel[] => {
  const { rooms, customer, bookedAt, id: orderId, source } = easymsBooking;
  const { name: customerName, address, countryCode, email, city, telephone } = customer;

  const [firstName, ...otherParts] = customerName.split(/\s+/);
  const lastName = otherParts.join(' ');

  return rooms.map((roomBooking) => {
    const cancelled = roomBooking.status === EasymsReservationStatus.CANCELLED;
    const living = roomBooking.status === EasymsReservationStatus.CHECKED_IN
      || roomBooking.status === EasymsReservationStatus.CHECKED_OUT;
    return ({
      id: roomBooking.roomReservationId,
      client: {
        id: orderId,
        firstName,
        lastName,
        address,
        city,
        country: countryCode,
        email,
        phone: telephone
      },
      room: {
        easymsRoomId: roomBooking.roomId
      },
      bookedAt: new Date(bookedAt),
      groupId: orderId,
      source,
      cancelled,
      living,
      prepaid: undefined,
      totalUahCoins: (roomBooking.invoice * 100).toString(),
      startDate: new Date(roomBooking.arrival),
      endDateExclusive: new Date(roomBooking.departure),
      numberOfGuests: roomBooking.numberOfGuests
    });
  });
};

export { mapEasymsBooking2BookingModel };
