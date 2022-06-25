import { fetchBookingNoteAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { BookingService } from '~@services';

const cbClearBookingNote: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId] = cbPayloadArray;
  await BookingService.setNote(bookingId, null);
  await ctx.deleteMessage(messageId);
  await fetchBookingNoteAndReply(ctx, { bookingId });
  await ctx.answerCbQuery('Очищено ✅');
};

export { cbClearBookingNote };
