import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { sendClientById } from '~/app/commands';

const cbRefreshClient: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, clientId] = cbPayloadArray;
  await sendClientById(clientId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { cbRefreshClient };
