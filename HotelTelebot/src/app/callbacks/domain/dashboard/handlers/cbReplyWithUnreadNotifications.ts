import { replyWithUnreadNotifications } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyWithUnreadNotifications: CallbackHandler = async ({ ctx }) => {
  await replyWithUnreadNotifications(ctx);
  await ctx.answerCbQuery();
};

export { cbReplyWithUnreadNotifications };
