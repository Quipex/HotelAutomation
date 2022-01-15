import { Context } from 'telegraf';
import putRemindedPrepayment from '../../../../api/calls/putRemindedPrepayment';

export async function setRemindedPrepaymentAndReply(ctx: Context, bookingId: string) {
  await putRemindedPrepayment(bookingId);
  await ctx.answerCbQuery('✅ Записано время');
}
