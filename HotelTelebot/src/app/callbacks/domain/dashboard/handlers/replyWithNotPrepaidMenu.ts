import { CallbackHandler } from '~@callbacks/CallbackHandler';

const replyWithNotPrepaidMenu: CallbackHandler = async ({ ctx }) => {
  await ctx.reply('wip');
  await ctx.answerCbQuery();
};

export { replyWithNotPrepaidMenu };
