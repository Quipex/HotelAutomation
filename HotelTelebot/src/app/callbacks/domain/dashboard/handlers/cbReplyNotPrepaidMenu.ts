import { generateNotPrepaidMenuAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyNotPrepaidMenu: CallbackHandler = async ({ ctx, messageId }) => {
  await generateNotPrepaidMenuAndReply(ctx, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyNotPrepaidMenu };
