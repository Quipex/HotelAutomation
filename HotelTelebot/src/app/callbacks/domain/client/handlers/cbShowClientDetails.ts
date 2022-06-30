import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { sendClientById } from '~/app/commands';

const cbShowClientDetails: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, clientId] = cbPayloadArray;
  await sendClientById(clientId, ctx, { reply_to_message_id: messageId });
  await ctx.answerCbQuery();
};

export { cbShowClientDetails };
