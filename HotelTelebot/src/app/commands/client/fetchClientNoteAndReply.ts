import { Context } from 'telegraf';
import { ClientService } from '~@services';
import { NoteMenu, NoteMenuActions } from '~@components';

type Args = {
  clientId: string,
  originalMessageId?: number
};

const entity = 'client';
const fetchClientNoteAndReply = async (ctx: Context, { clientId, originalMessageId }: Args) => {
  const { notes } = await ClientService.getNote(clientId);
  await ctx.replyWithHTML(NoteMenu(notes, { entity, entityId: clientId }), {
    reply_to_message_id: originalMessageId,
    reply_markup: { inline_keyboard: NoteMenuActions(entity, clientId) }
  });
};

export { fetchClientNoteAndReply };
