import { findBookingByIdAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { BookingService } from '~@services';

const setRemindedPrepaymentAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId] = cbPayloadArray;
  await BookingService.putRemindedPrepayment(bookingId);
  await findBookingByIdAndReply(bookingId, ctx);
  await ctx.deleteMessage(messageId);
  await ctx.answerCbQuery('✅ Записано время');
};

export { setRemindedPrepaymentAndReply };
