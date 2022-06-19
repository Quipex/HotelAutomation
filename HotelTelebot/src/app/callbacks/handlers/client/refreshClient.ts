import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { sendClientById } from '~@commands/client/client_by_id';

const refreshClient: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, clientId] = cbPayloadArray;
  await sendClientById(clientId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { refreshClient };
