import { fetchBookingNoteAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbShowBookingNoteMenu: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId] = cbPayloadArray;
  await fetchBookingNoteAndReply(ctx, { bookingId, originalMessageId: messageId });
  await ctx.answerCbQuery();
};

export { cbShowBookingNoteMenu };
