import { replyWithBookingsThatNeedRemindings } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyNeedReminding: CallbackHandler = async ({ ctx, messageId }) => {
  await replyWithBookingsThatNeedRemindings(ctx, undefined, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyNeedReminding };
