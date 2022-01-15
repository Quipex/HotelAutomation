import { Context } from 'telegraf';
import { fetchBookingByIdAndReply } from '../../../commands/booking/bookings_by_id';

export async function refreshBooking(ctx: Context, bookingId: string, originalMessageId?: number) {
  await fetchBookingByIdAndReply(bookingId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  if (originalMessageId) {
    await ctx.telegram.deleteMessage(ctx.chat?.id as number, originalMessageId);
  } else {
    await ctx.deleteMessage(ctx.update.callback_query.message?.message_id);
  }
}
