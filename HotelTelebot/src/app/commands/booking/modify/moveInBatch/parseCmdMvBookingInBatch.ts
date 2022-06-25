// noinspection ES6PreferShortImport

import { Context } from 'telegraf';
import { mvBookingInBatchAndReply, RoomToDays } from './mvBookingInBatchAndReply';

const roomToDaysRegex = /^(\d+)\((\d+)\)$/;

const usageHtml = 'usage:\n<code>/mv_batch bookingId room(days) [room(days)...]</code>';

const parseCmdMvBookingInBatch = async (ctx: Context): Promise<void> => {
  const messageText = ctx.message!.text;
  const commandTokens = messageText.split(' ');
  const [bookingId] = commandTokens;
  if (commandTokens.length < 3) {
    await ctx.replyWithHTML(usageHtml);
    return;
  }
  const roomsToDays: RoomToDays[] = commandTokens.slice(2).map((roomToDaysText) => {
    const parsedTokens = roomToDaysRegex.exec(roomToDaysText);
    if (!parsedTokens || parsedTokens.length < 3) {
      ctx.replyWithHTML(`Не понял что за <code>'${roomToDaysText}'</code>, должно быть <code>room(days)</code>`);
      throw new Error('Invalid rooms to days');
    }
    return {
      room: parsedTokens[1],
      days: parsedTokens[2]
    };
  });
  await mvBookingInBatchAndReply(ctx, { bookingId, roomsToDays });
};

export { parseCmdMvBookingInBatch };
