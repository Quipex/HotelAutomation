import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { parseDateAndReplyToInvalid } from './bookings_added';

async function replyWithMoveBookingUsageManual(ctx: Context) {
  return ctx.replyWithHTML(
    'usage:\n<code>/mv bookingId roomNumber [date]</code>'
  );
}

async function parseCommandMoveBookingAndReply(ctx: Context, next: () => Promise<void>) {
  const messageText = ctx.message!.text;
  let bookingId;
  let roomNumber;
  let
    date;
  try {
    const commandTokens = messageText.split(' ');
    [, bookingId, roomNumber] = commandTokens;
    if (commandTokens.length < 3) {
      await replyWithMoveBookingUsageManual(ctx);
    }
    if (commandTokens.length > 3) {
      date = await parseDateAndReplyToInvalid(ctx, commandTokens[3]);
      if (!date) {
        await next();
        return;
      }
    }
  } catch (e) {
    await replyWithMoveBookingUsageManual(ctx);
  }
  await BookingsService.moveBooking({ bookingId, roomNumber, date });
  await ctx.reply('Moved ✅', { reply_to_message_id: ctx.message?.message_id });
}

async function replyWithMoveBookingInBatchUsageManual(ctx: Context) {
  return ctx.replyWithHTML(
    'usage:\n<code>/mv_batch bookingId room(days) [room(days)...]</code>'
  );
}

const roomToDaysRegex = /^(\d+)\((\d+)\)$/;

async function parseCommandMoveBookingInBatchAndReply(ctx: Context): Promise<void> {
  const messageText = ctx.message!.text;
  let bookingId;
  let
    roomsToDays;
  try {
    const commandTokens = messageText.split(' ');
    [bookingId] = commandTokens;
    if (commandTokens.length < 3) {
      await replyWithMoveBookingInBatchUsageManual(ctx);
      return;
    }
    if (commandTokens.length >= 3) {
      roomsToDays = commandTokens.slice(2).map((roomToDaysText) => {
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
    }
  } catch (e) {
    await replyWithMoveBookingInBatchUsageManual(ctx);
    return;
  }
  const reportPlan = await BookingsService.moveBookingInBatch({ bookingId, roomsToDays });
  await ctx.replyWithHTML(
    `Moved ✅\n<code>${JSON.stringify(reportPlan, null, 2)}</code>`,
    { reply_to_message_id: ctx.message?.message_id }
  );
}

export {
  parseCommandMoveBookingAndReply,
  parseCommandMoveBookingInBatchAndReply
};
