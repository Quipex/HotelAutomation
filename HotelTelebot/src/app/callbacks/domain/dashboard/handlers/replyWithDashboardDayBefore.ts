import { replyWithDashboard } from '~/app/commands';
import { DATE_GENERAL } from '~/common/constants';
import { subtractFromDate } from '~/common/utils/dates';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const replyWithDashboardDayBefore: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, date] = cbPayloadArray;
  const dayBefore = subtractFromDate({ date: new Date(date), unit: 'days', amount: 1 }).format(DATE_GENERAL);
  await replyWithDashboard(ctx, dayBefore, messageId);
  await ctx.answerCbQuery();
};

export { replyWithDashboardDayBefore };
