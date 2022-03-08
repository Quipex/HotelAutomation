import { Context } from 'telegraf';
import { BookingsService } from '@services';

export async function setRemindedPrepaymentAndReply(ctx: Context, bookingId: string) {
  await BookingsService.putRemindedPrepayment(bookingId);
  await ctx.answerCbQuery('✅ Записано время');
}
