import { replyWithDashboard } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { synchronizeData } from '~@commands/actions/synchronize/synchronizeData';

const refreshDashboard: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, date] = cbPayloadArray;
  await synchronizeData();
  await replyWithDashboard(ctx, date);
  await ctx.answerCbQuery('Синхронизировано ✅');
  await ctx.deleteMessage(messageId);
};

export { refreshDashboard };
