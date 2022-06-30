import { composeCallbackData } from '~@callbacks/helpers';

const prefix = (text) => `r${text}`;

const roomShowNote = prefix('Note');
const cbPayloadRoomShowNote = (roomNumber: string) => {
  return composeCallbackData(roomShowNote, roomNumber);
};

const roomClearNote = prefix('RmNote');
const cbPayloadRoomClearNote = (roomNumber: string) => {
  return composeCallbackData(roomClearNote, roomNumber);
};

const roomDetails = prefix('D');
const cbPayloadRoomDetails = (roomNumber: string) => `${roomDetails}|${roomNumber}`;

export {
  roomClearNote,
  roomShowNote,
  cbPayloadRoomClearNote,
  cbPayloadRoomShowNote,
  cbPayloadRoomDetails,
  roomDetails
};
