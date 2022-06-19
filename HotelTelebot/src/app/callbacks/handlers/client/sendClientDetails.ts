import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { sendClientById } from '~@commands/client/client_by_id';

const sendClientDetails: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, clientId] = cbPayloadArray;
  await sendClientById(clientId, ctx, { reply_to_message_id: messageId });
  await ctx.answerCbQuery();
};

export { sendClientDetails };
