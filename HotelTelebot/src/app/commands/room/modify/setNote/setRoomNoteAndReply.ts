import { Context } from 'telegraf';
import { COMMAND_ROOM_BY_NUMBER } from '~/common/constants';
import { RoomService } from '~@services';

type Args = {
  roomNumber: string,
  noteText: string
};

const setRoomNoteAndReply = async (ctx: Context, { noteText, roomNumber }: Args) => {
  await RoomService.setNote(roomNumber, noteText);
  await ctx.replyWithHTML(`Заметка о <code>/${COMMAND_ROOM_BY_NUMBER} ${roomNumber}</code> обновлена ✅`);
};

export { setRoomNoteAndReply };
