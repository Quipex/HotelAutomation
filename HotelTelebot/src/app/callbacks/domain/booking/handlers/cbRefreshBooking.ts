import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { fetchBookingByIdAndReply } from '~/app/commands';

const cbRefreshBooking: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, bookingId] = cbPayloadArray;
  await fetchBookingByIdAndReply(bookingId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { cbRefreshBooking };
