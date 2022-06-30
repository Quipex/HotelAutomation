import { RoomTypeDto } from '~/common/types';
import { RoomTypeModel } from '~/domain/room_types/RoomTypeModel';

const mapRoomTypeModel2dto = (model: RoomTypeModel): RoomTypeDto => ({
  name: model.name,
  maxAdults: model.maxAdults,
  preferredAdults: model.preferredAdults
});

export {
  mapRoomTypeModel2dto
};
