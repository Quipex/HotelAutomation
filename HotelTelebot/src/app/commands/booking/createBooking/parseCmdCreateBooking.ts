import { Context } from 'telegraf';
import { parseDateFromLiterals } from '~/common/utils/dates';
// noinspection ES6PreferShortImport
import { createBookingAndReply } from './createBookingAndReply';

const replyWithUsageManual = async (ctx: Context) => {
  return ctx.replyWithHTML(
    'usage:\n'
    + '<code>/create fromDateInclusive toDateExclusive roomNumber guestName</code>'
  );
};

const parseCmdCreateBooking = async (ctx: Context) => {
  const messageText = ctx.message!.text;
  const commandTokens = messageText.split(' ');
  const [, rawFromDate, rawToDate, roomNumber] = commandTokens;
  const fromDate = parseDateFromLiterals(rawFromDate);
  const toDate = parseDateFromLiterals(rawToDate);
  const guestName = commandTokens.slice(4).join(' ');
  if (!fromDate || !toDate || !guestName) {
    await replyWithUsageManual(ctx);
    return;
  }

  await createBookingAndReply(ctx, { fromDate, toDate, roomNumber, guestName });
};

export { parseCmdCreateBooking };
