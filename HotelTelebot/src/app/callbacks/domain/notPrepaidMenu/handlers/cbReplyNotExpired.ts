import { replyWithNotPrepaidRemindedNotExpired } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyNotExpired: CallbackHandler = async ({ ctx, messageId }) => {
  await replyWithNotPrepaidRemindedNotExpired(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyNotExpired };
