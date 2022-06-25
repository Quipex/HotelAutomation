import { replyWithDashboard } from '~/app/commands';
import { formatDate } from '~/common/utils/dates';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyWithDashboardToday: CallbackHandler = async ({ ctx, messageId }) => {
  await replyWithDashboard(ctx, formatDate(new Date()), messageId);
  await ctx.answerCbQuery();
};

export { cbReplyWithDashboardToday };
