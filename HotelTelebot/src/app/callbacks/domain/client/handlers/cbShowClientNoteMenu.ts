import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { fetchClientNoteAndReply } from '~@commands/client/fetchClientNoteAndReply';

const cbShowClientNoteMenu: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, clientId] = cbPayloadArray;
  await fetchClientNoteAndReply(ctx, { clientId, originalMessageId: messageId });
  await ctx.answerCbQuery();
};

export { cbShowClientNoteMenu };
