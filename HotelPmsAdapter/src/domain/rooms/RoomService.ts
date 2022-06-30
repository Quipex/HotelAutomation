import { mapRoomModel2dto } from '~/common/mappings/dto';
import RoomRepository from './RoomRepository';

const findRoomByNumber = async (roomNumber: number) => {
  const foundRoom = await RoomRepository.findRoomByNumber(roomNumber);
  return mapRoomModel2dto(foundRoom);
};

const setNote = async (roomNumber: string, textNote: string) => {
  await RoomRepository.setNote(Number(roomNumber), textNote);
};

const getNote = async (roomNumber: string) => {
  return RoomRepository.getNote(Number(roomNumber));
};

export default {
  findRoomByNumber,
  setNote,
  getNote
};
