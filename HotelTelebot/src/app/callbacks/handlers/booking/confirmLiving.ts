import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { refreshBooking } from './refreshBooking';

export async function confirmLivingAndReply(ctx: Context, bookingId: string, originalMessageId: number) {
  await BookingsService.confirmLiving(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(ctx.update.callback_query.message?.message_id);
  await refreshBooking(ctx, bookingId, originalMessageId);
}
