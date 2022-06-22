import { replyWithNotPrepaidRemindedExpired } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyExpired: CallbackHandler = async ({ ctx, messageId }) => {
  await replyWithNotPrepaidRemindedExpired(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyExpired };
