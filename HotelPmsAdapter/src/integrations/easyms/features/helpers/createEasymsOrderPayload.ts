import { CreateBookingPayload } from '~/common/types';
import { dateToUnixMilliseconds } from '~/common/utils/dates';
import env from '~/config/env';
import { getRepository } from '~/domain/helpers/orm';
import { RoomModel } from '~/domain/rooms/RoomModel';
import { generateEasymsId } from './generateEasymsId';

const createEasymsOrderPayload = async ({ roomNumber, to, guestName, from }: CreateBookingPayload) => {
  const foundRoom = await getRepository(RoomModel).findOne({ where: { realRoomNumber: roomNumber } });
  if (!foundRoom) {
    throw new Error(`Room number does not exist '${roomNumber}'`);
  }
  const { easymsRoomId: roomId, roomType: { preferredAdults, easymsId: categoryId } } = foundRoom;
  return {
    id: generateEasymsId(),
    organizationId: env.easyMsOrgId,
    status: 'ok',
    services: [],
    source: 'easyms',
    rooms: [{
      roomReservationId: generateEasymsId(),
      categoryId,
      roomId,
      currencyCode: 'UAH',
      numberOfGuests: preferredAdults,
      smoking: false,
      addOns: [],
      arrival: dateToUnixMilliseconds(from),
      departure: dateToUnixMilliseconds(to),
      guestName,
      rateId: env.easyMsRateId,
      status: 'booked',
      hotelExtraCharges: [],
      guestExtraCharges: [],
      invoice: 0,
      paid: 0,
      locked: false
    }],
    customer: { name: guestName }
  };
};

export { createEasymsOrderPayload };
