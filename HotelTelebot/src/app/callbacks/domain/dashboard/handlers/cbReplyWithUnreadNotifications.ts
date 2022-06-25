import { parseCmdFindUnreadNotifications } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyWithUnreadNotifications: CallbackHandler = async ({ ctx, messageId }) => {
  await parseCmdFindUnreadNotifications(ctx, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyWithUnreadNotifications };
