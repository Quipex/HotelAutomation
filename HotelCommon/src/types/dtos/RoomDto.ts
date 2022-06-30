import { BalconySide } from '../room';
// noinspection ES6PreferShortImport
import { RoomTypeDto } from './RoomTypeDto';

type RoomDto = {
  realRoomNumber: number,
  roomType: RoomTypeDto,
  floor: number,
  side: BalconySide,
  hasSeaView: boolean,
  notes: string
};

export type { RoomDto };
