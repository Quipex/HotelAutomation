import { Context } from 'telegraf';
// noinspection ES6PreferShortImport
import { findBookingByIdAndReply } from './findBookingByIdAndReply';

const parseCmdFindBookingById = async (ctx: Context) => {
  const messageWords = ctx.message?.text?.split(' ');
  if (!messageWords || messageWords.length < 2) {
    return ctx.reply('Id missing ❌');
  }
  const [, bookingId] = messageWords;
  return findBookingByIdAndReply(bookingId, ctx);
};

export { parseCmdFindBookingById };
