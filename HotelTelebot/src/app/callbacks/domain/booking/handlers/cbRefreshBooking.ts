import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { findBookingByIdAndReply } from '~/app/commands';

const cbRefreshBooking: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, bookingId] = cbPayloadArray;
  await findBookingByIdAndReply(bookingId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { cbRefreshBooking };
