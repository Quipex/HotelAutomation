import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { sendClientById } from '~/app/commands';

const refreshClient: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, clientId] = cbPayloadArray;
  await sendClientById(clientId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  await ctx.deleteMessage(messageId);
};

export { refreshClient };
