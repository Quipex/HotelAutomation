import { Context } from 'telegraf';
import putConfirmLiving from '../../../../api/calls/putConfirmLiving';
import { refreshBooking } from './refreshBooking';

export async function confirmLivingAndReply(ctx: Context, bookingId: string, originalMessageId: number) {
  await putConfirmLiving(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(ctx.update.callback_query.message?.message_id);
  await refreshBooking(ctx, bookingId, originalMessageId);
}
