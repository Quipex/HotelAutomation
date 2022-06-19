import { replyWithDashboard } from '~/app/commands';
import { CallbackHandler } from '../../CallbackHandler';

const refreshDashboard: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, date] = cbPayloadArray;
  await replyWithDashboard(ctx, date);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { refreshDashboard };
