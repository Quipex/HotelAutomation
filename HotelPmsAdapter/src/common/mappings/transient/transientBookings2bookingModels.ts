import { BookingTransientModel } from '~/common/types/domain/transient_models';
import { BookingModel } from '~/domain/bookings/BookingModel';
import { ClientModel } from '~/domain/clients/ClientModel';
import { RoomModel } from '~/domain/rooms/RoomModel';

type TransientBookings2bookingModels = (
  args: {
    transientBookings: BookingTransientModel[],
    clientModels: ClientModel[],
    savedRooms: RoomModel[]
  }
) => BookingModel[];

const transientBookings2bookingModels: TransientBookings2bookingModels = (
  { clientModels, transientBookings, savedRooms }
) => {
  return transientBookings.map((transientBooking) => {
    const { groupId, room: transientRoom } = transientBooking;
    const client = clientModels.find((cl) => cl.id === groupId);
    const room = savedRooms.find((r) => (
      transientRoom.pmscloudRoomId === r.pmscloudRoomId || transientRoom.easymsRoomId === r.easymsRoomId
    ));
    return new BookingModel({
      ...transientBooking,
      totalUahCoins: transientBooking.totalUahCoins.toString(),
      createdAt: null,
      updatedAt: null,
      carPlates: null,
      prepaymentRemindings: null,
      client,
      room
    });
  });
};

export { transientBookings2bookingModels };
