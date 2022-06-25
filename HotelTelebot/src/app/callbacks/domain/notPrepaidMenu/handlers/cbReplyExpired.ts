import { findNotPrepaidRemindedExpiredAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyExpired: CallbackHandler = async ({ ctx, messageId }) => {
  await findNotPrepaidRemindedExpiredAndReply(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyExpired };
