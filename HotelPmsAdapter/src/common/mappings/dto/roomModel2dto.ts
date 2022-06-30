import { mapRoomTypeModel2dto } from '~/common/mappings/dto/roomTypeModel2dto';
import { RoomDto } from '~/common/types';
import { RoomModel } from '~/domain/rooms/RoomModel';

const mapRoomModel2dto = (model: RoomModel): RoomDto => ({
  realRoomNumber: model.realRoomNumber,
  roomType: mapRoomTypeModel2dto(model.roomType),
  floor: model.floor,
  side: model.side,
  hasSeaView: model.hasSeaView,
  notes: model.notes
});

export { mapRoomModel2dto };
