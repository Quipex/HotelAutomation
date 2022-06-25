import { Context } from 'telegraf';
import { parseDateAndReplyToInvalid } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { mvBookingAndReply } from './mvBookingAndReply';

const usageHtml = 'usage:\n<code>/mv bookingId roomNumber [date]</code>';

const parseCmdMvBooking = async (ctx: Context) => {
  const messageText = ctx.message!.text;
  const commandTokens = messageText.split(' ');
  const [, bookingId, roomNumber] = commandTokens;
  if (commandTokens.length < 4) {
    await ctx.replyWithHTML(usageHtml);
    return;
  }
  const date = await parseDateAndReplyToInvalid(ctx, commandTokens[3]);
  if (!date) {
    return;
  }
  await mvBookingAndReply(ctx, { bookingId, roomNumber, date });
};

export { parseCmdMvBooking };
