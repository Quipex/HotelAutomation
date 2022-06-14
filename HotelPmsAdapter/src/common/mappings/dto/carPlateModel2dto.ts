import { mapBookingModel2dto } from '~/common/mappings/dto';
import { CarPlateDto } from '~/common/types';
import { dateToIsoString } from '~/common/utils/dates';
import { CarPlateModel } from '~/domain/car_plates/CarPlateModel';

const mapCarPlateModel2dto = (carPlateModel: CarPlateModel): CarPlateDto => {
  const { createdAt, booking, value, updatedAt } = carPlateModel;
  return {
    value,
    booking: booking ? mapBookingModel2dto(booking) : undefined,
    createdAt: dateToIsoString(createdAt),
    updatedAt: dateToIsoString(updatedAt)
  };
};

export { mapCarPlateModel2dto };
