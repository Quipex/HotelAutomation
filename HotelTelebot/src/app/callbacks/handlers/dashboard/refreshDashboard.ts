import { replyWithDashboard } from '~/app/commands';
import { synchronizeBookings } from '~/app/schedules/jobs/synchronizeData/synchronizeBookings';
import { CallbackHandler } from '../../CallbackHandler';

const refreshDashboard: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, date] = cbPayloadArray;
  await synchronizeBookings();
  await replyWithDashboard(ctx, date);
  await ctx.answerCbQuery('Синхронизировано ✅');
  await ctx.deleteMessage(messageId);
};

export { refreshDashboard };
