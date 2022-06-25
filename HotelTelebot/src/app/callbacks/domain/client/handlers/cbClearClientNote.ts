import { fetchClientNoteAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { ClientService } from '~@services';

const cbClearClientNote: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, clientId] = cbPayloadArray;
  await ClientService.setNote(clientId, null);
  await ctx.deleteMessage(messageId);
  await fetchClientNoteAndReply(ctx, { clientId });
  await ctx.answerCbQuery('Очищено ✅');
};

export { cbClearClientNote };
