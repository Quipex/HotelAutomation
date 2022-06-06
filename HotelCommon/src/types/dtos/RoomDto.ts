import { RoomTypeDto } from './RoomTypeDto';

type RoomDto = {
  realRoomNumber: number,
  roomType: RoomTypeDto,
  floor: number,
  side: string,
  hasSeaView: boolean
};

export type { RoomDto };
