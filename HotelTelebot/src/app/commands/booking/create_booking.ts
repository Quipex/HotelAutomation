import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { parseDate } from '~/common/utils/dates.helper';

async function replyWithUsageManual(ctx: Context) {
  return ctx.replyWithHTML(
    'usage:\n'
    + '<code>/create fromDateInclusive toDateExclusive roomNumber guestName</code>'
  );
}

async function parseCommandCreateBookingAndReply(ctx: Context) {
  try {
    const messageText = ctx.message!.text;
    const commandTokens = messageText.split(' ');
    const [rawFromDate, rawToDate, roomNumber] = commandTokens;
    const fromDate = parseDate(rawFromDate);
    const toDate = parseDate(rawToDate);
    const guestName = commandTokens.slice(4).join(' ');
    if (!fromDate || !toDate || !commandTokens[4]) {
      await replyWithUsageManual(ctx);
      return;
    }

    const { newId } = await BookingsService.createBooking({ from: fromDate, to: toDate, roomNumber, guestName }) as any;
    await ctx.reply(`Created ✅ /id ${newId}`, { reply_to_message_id: ctx.message?.message_id });
  } catch (e) {
    await replyWithUsageManual(ctx);
  }
}

export default parseCommandCreateBookingAndReply;
