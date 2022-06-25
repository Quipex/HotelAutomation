import { findNotMarkedAsLivingAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyWithNotMarkedLivingBookings: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, date] = cbPayloadArray;
  await findNotMarkedAsLivingAndReply(ctx, date, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyWithNotMarkedLivingBookings };
