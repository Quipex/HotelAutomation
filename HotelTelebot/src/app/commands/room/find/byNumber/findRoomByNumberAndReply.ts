import { Context } from 'telegraf';
import { Room, RoomActions } from '~@components';
import { RoomService } from '~@services';

const findRoomByNumberAndReply = async (ctx: Context, roomNumberAsString: string, originalMessageId?: number) => {
  const roomNumber = Number(roomNumberAsString);
  if (Number.isNaN(roomNumber)) {
    await ctx.reply(`❌ invalid room number '${roomNumberAsString}'`);
    return;
  }
  const room = await RoomService.fetchRoomByNumber(roomNumber);

  await ctx.replyWithHTML(Room(room), {
    reply_to_message_id: originalMessageId ?? ctx.message.message_id,
    reply_markup: { inline_keyboard: RoomActions(room) }
  });
};

export { findRoomByNumberAndReply };
