import { fetchBookingByIdAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { BookingsService } from '~@services';

const setRemindedPrepaymentAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId] = cbPayloadArray;
  await BookingsService.putRemindedPrepayment(bookingId);
  await fetchBookingByIdAndReply(bookingId, ctx);
  await ctx.deleteMessage(messageId);
  await ctx.answerCbQuery('✅ Записано время');
};

export { setRemindedPrepaymentAndReply };
