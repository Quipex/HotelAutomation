import { Context } from 'telegraf';
import { COMMAND_CLIENT_BY_ID } from '~/common/constants';
import { ClientService } from '~@services';

type Args = {
  clientId: string,
  noteText: string
};

const setClientNoteAndReply = async (ctx: Context, { noteText, clientId }: Args) => {
  await ClientService.setNote(clientId, noteText);
  await ctx.replyWithHTML(`Заметка о <code>/${COMMAND_CLIENT_BY_ID} ${clientId}</code> обновлена ✅`);
};

export { setClientNoteAndReply };
