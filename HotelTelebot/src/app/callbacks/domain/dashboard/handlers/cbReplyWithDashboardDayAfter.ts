import { replyWithDashboard } from '~/app/commands';
import { DATE_GENERAL } from '~/common/constants';
import { addToDate } from '~/common/utils/dates';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbReplyWithDashboardDayAfter: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, date] = cbPayloadArray;
  const dayAfter = addToDate({ date: new Date(date), unit: 'days', amount: 1 }).format(DATE_GENERAL);
  await replyWithDashboard(ctx, dayAfter, messageId);
  await ctx.answerCbQuery();
};

export { cbReplyWithDashboardDayAfter };
