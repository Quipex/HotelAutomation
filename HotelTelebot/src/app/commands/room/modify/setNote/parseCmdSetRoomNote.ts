import { Context } from 'telegraf';
import { getCommandAndFirstArg } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { setRoomNoteAndReply } from './setRoomNoteAndReply';

const parseCmdSetRoomNote = async (ctx: Context) => {
  const msgText = ctx.message.text;
  const { commandAndFirstArg, firstArg: roomNumber } = getCommandAndFirstArg(msgText);
  const noteText = msgText.slice(commandAndFirstArg.length);

  await setRoomNoteAndReply(ctx, { noteText, roomNumber });
};

export { parseCmdSetRoomNote };
