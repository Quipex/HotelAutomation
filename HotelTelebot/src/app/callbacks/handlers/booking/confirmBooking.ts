import { Context } from 'telegraf';
import putConfirmBooking from '../../../../api/calls/putConfirmBooking';
import { refreshBooking } from './refreshBooking';

export async function confirmBookingAndReply(ctx: Context, bookingId: string, originalMessageId: number) {
  await putConfirmBooking(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(ctx.update.callback_query.message?.message_id);
  await refreshBooking(ctx, bookingId, originalMessageId);
}
