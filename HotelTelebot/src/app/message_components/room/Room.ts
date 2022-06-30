import { ShortNote } from '~/app/message_components';
import { RoomDto } from '~/common/types';
import { getBalconySideText } from './common';
import RoomType from './RoomType';

const b = (text: string) => `<b>${text}</b>`;

const Room = ({ realRoomNumber, roomType, side, floor, hasSeaView, notes }: RoomDto) => {
  const noteSection: string[] = notes
    ? ['', `Заметки : ${b(ShortNote(notes))}`]
    : [];

  return [
    `№ : ${realRoomNumber}`,
    `Этаж : ${floor}`,
    b(hasSeaView ? 'Море видно 🌊⛱' : 'Моря не видно 🙅‍♂️'),
    `Балкон смотрит : ${getBalconySideText(side)}`,
    ...noteSection,
    '',
    RoomType(roomType)
  ].join('\n');
};

export default Room;
