import { CallbackHandler } from '../../CallbackHandler';

const replyWithNotMarkedLivingBookings: CallbackHandler = async ({ ctx }) => {
  await ctx.reply('wip');
  await ctx.answerCbQuery();
};

export { replyWithNotMarkedLivingBookings };
