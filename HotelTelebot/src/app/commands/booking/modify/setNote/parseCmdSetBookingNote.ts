import { Context } from 'telegraf';
import { getCommandAndFirstArg } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { setBookingNoteAndReply } from './setBookingNoteAndReply';

const parseCmdSetBookingNote = async (ctx: Context) => {
  const msgText = ctx.message.text;
  const { commandAndFirstArg, firstArg: bookingId } = getCommandAndFirstArg(msgText);
  const noteText = msgText.slice(commandAndFirstArg.length);

  await setBookingNoteAndReply(ctx, { noteText, bookingId });
};

export { parseCmdSetBookingNote };
