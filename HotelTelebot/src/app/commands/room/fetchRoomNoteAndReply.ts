import { Context } from 'telegraf';
import { NoteMenu, NoteMenuActions } from '~@components';
import { RoomService } from '~@services';

type Args = {
  roomNumber: string,
  originalMessageId?: number
};

const entity = 'room';
const fetchRoomNoteAndReply = async (ctx: Context, { roomNumber, originalMessageId }: Args) => {
  const { notes } = await RoomService.getNote(roomNumber);
  await ctx.replyWithHTML(NoteMenu(notes, { entity, entityId: roomNumber.toString() }), {
    reply_to_message_id: originalMessageId,
    reply_markup: { inline_keyboard: NoteMenuActions(entity, roomNumber.toString()) }
  });
};

export { fetchRoomNoteAndReply };
