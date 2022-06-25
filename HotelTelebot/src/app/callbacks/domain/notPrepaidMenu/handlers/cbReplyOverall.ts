import { findNotPrepaidOverallAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyOverall: CallbackHandler = async ({ ctx, messageId }) => {
  await findNotPrepaidOverallAndReply(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyOverall };
