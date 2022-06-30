import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { RoomDto } from '~/common/types';
import { cbPayloadRoomShowNote } from '~@callbacks/domain/room/actions';

const RoomActions = (room: RoomDto): InlineKeyboardButton[][] => {
  const inlineButtons: InlineKeyboardButton[][] = [];

  inlineButtons.push([{
    text: 'Заметки 📝',
    callback_data: cbPayloadRoomShowNote(room.realRoomNumber.toString()),
    hide: false
  }]);

  return inlineButtons;
};

export default RoomActions;
