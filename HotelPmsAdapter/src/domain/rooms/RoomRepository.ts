import { getRepository } from '../helpers/orm';
import { RoomModel } from './RoomModel';

const findRoomByNumber = async (roomNumber: number) => {
  const roomRepo = getRepository(RoomModel);

  return roomRepo.findOneBy({ realRoomNumber: roomNumber });
};

const setNote = async (roomNumber: number, text: string) => {
  const roomRepo = getRepository(RoomModel);

  await roomRepo.update({ realRoomNumber: roomNumber }, { notes: text });
};

const getNote = async (roomNumber: number) => {
  const roomRepo = getRepository(RoomModel);

  return roomRepo.findOneBy({ realRoomNumber: roomNumber });
};

export default {
  findRoomByNumber,
  setNote,
  getNote
};
