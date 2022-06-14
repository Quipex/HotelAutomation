import { CallbackHandler } from '@callbacks/CallbackHandler';

const replyWithMoveBookingUsage: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId] = cbPayloadArray;
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`<code>/mv ${bookingId} roomNumber [date]</code>`, {
    reply_to_message_id: messageId
  });
};

export { replyWithMoveBookingUsage };
