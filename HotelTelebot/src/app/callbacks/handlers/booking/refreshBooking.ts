import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { fetchBookingByIdAndReply } from '~@commands/booking/bookings_by_id';

const refreshBooking: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, bookingId] = cbPayloadArray;
  await fetchBookingByIdAndReply(bookingId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { refreshBooking };
