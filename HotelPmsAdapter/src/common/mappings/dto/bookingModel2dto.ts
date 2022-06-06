import { mapPrepaymentRemindingModel2dto } from '~/common/mappings/dto/prepaymentRemindingModel2dto';
import { dateToIsoString } from '~/common/utils/dates';
import { BookingDto } from '~/common/types';
import { BookingModel } from '~/domain/bookings/BookingModel';
import { mapCarPlateModel2dto } from './carPlateModel2dto';
import { mapClientModel2dto } from './clientModel2dto';

const mapBookingModel2dto = (bookingModel: BookingModel): BookingDto => {
  const {
    id,
    cancelled,
    startDate,
    endDateExclusive,
    bookedAt,
    createdAt,
    updatedAt,
    totalUahCoins,
    prepaid,
    living,
    groupId,
    source,
    numberOfGuests,
    notes,
    prepaymentRemindings,
    carPlates,
    client,
    room
  } = bookingModel;

  return {
    id,
    cancelled,
    startDate: startDate.toString(),
    endDateExclusive: endDateExclusive.toString(),
    bookedAt: dateToIsoString(bookedAt),
    createdAt: dateToIsoString(createdAt),
    updatedAt: dateToIsoString(updatedAt),
    totalUahCoins,
    prepaid,
    living,
    groupId,
    source,
    numberOfGuests,
    notes,
    prepaymentRemindings: prepaymentRemindings.map(mapPrepaymentRemindingModel2dto),
    carPlates: carPlates.map(mapCarPlateModel2dto),
    client: mapClientModel2dto(client),
    room
  };
};

export { mapBookingModel2dto };
