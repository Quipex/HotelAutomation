import { CallbackHandler } from '../../CallbackHandler';

const replyWithUnreadNotifications: CallbackHandler = async ({ ctx }) => {
  await ctx.reply('wip');
  await ctx.answerCbQuery();
};

export { replyWithUnreadNotifications };
