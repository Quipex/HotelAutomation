import { Context } from 'telegraf';
import { getCommandAndFirstArg } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { setClientNoteAndReply } from './setClientNoteAndReply';

const parseCmdSetClientNote = async (ctx: Context) => {
  const msgText = ctx.message.text;
  const { commandAndFirstArg, firstArg: clientId } = getCommandAndFirstArg(msgText);
  const noteText = msgText.slice(commandAndFirstArg.length);

  await setClientNoteAndReply(ctx, { noteText, clientId });
};

export { parseCmdSetClientNote };
