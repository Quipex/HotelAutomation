import { replyWithUnreadNotifications } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyWithUnreadNotifications: CallbackHandler = async ({ ctx, messageId }) => {
  await replyWithUnreadNotifications(ctx, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyWithUnreadNotifications };
