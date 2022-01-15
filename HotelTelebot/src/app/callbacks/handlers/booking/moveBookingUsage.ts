import { Context } from 'telegraf';

export async function replyWithMoveBookingUsage(ctx: Context, bookingId: string, originalMessageId: number) {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`<code>/mv ${bookingId} roomNumber [date]</code>`, {
    reply_to_message_id: originalMessageId
  });
}
