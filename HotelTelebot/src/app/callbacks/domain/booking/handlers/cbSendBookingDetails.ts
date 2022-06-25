import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { findBookingByIdAndReply } from '~/app/commands';

const cbSendBookingDetails: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, id] = cbPayloadArray;
  await findBookingByIdAndReply(id, ctx, { reply_to_message_id: messageId });
  await ctx.answerCbQuery();
};

export { cbSendBookingDetails };
