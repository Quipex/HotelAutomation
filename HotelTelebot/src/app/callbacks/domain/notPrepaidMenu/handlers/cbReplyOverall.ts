import { replyWithNotPrepaidOverall } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyOverall: CallbackHandler = async ({ ctx, messageId }) => {
  await replyWithNotPrepaidOverall(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyOverall };
