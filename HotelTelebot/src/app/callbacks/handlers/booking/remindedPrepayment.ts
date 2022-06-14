import { CallbackHandler } from '@callbacks/CallbackHandler';
import { BookingsService } from '@services';

const setRemindedPrepaymentAndReply: CallbackHandler = async ({ ctx, cbPayloadArray }) => {
  const [, bookingId] = cbPayloadArray;
  await BookingsService.putRemindedPrepayment(bookingId);
  await ctx.answerCbQuery('✅ Записано время');
};

export { setRemindedPrepaymentAndReply };
