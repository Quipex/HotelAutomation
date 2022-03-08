/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { parseDateAsUnix } from '../../../utils/dates.helper';
import BriefBooking from '../../message_components/booking/BriefBooking';
import briefBookingActions from '../../message_components/booking/BriefBookingActions';

/**
 * As unix
 */
export async function parseDateAndReplyToInvalid(ctx: Context, text?: string): Promise<number | undefined> {
  const messageText = text ?? ctx.message!.text;
  const commandTokens = messageText.split(' ');
  let date: number | undefined;
  if (commandTokens.length < 2) {
    date = parseDateAsUnix('today');
  } else {
    date = parseDateAsUnix(commandTokens[1]);
  }
  if (date === undefined) {
    await ctx.reply(`❌ Unrecognized date: ${commandTokens[1]}`);
  }
  return date;
}

interface FindBookingsOptions {
  commandText?: string;
  messageReplyId?: number;
}

async function parseCommandFindBookingsAddedAfterAndReply(ctx: Context, next, options?: FindBookingsOptions) {
  const date = await parseDateAndReplyToInvalid(ctx, options?.commandText);
  if (!date) {
    return next();
  }
  const todayArrivals = await BookingsService.fetchBookingsAddedAfter(date);
  // eslint-disable-next-line no-restricted-syntax
  for (const booking of todayArrivals) {
    // eslint-disable-next-line no-await-in-loop
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: (options?.messageReplyId ?? ctx.message?.message_id),
      reply_markup: { inline_keyboard: briefBookingActions(booking) }
    });
  }
  return next();
}

export default parseCommandFindBookingsAddedAfterAndReply;
