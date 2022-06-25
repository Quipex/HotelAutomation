import { findNotPrepaidNeedRemindingsAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyNeedReminding: CallbackHandler = async ({ ctx, messageId }) => {
  await findNotPrepaidNeedRemindingsAndReply(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyNeedReminding };
