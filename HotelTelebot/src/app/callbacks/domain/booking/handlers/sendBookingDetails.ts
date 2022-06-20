import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { fetchBookingByIdAndReply } from '~/app/commands';

const sendBookingDetails: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, id] = cbPayloadArray;
  await fetchBookingByIdAndReply(id, ctx, { reply_to_message_id: messageId });
  await ctx.answerCbQuery();
};

export { sendBookingDetails };
