import { BriefBooking, BriefBookingActions } from '@components';
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate, parseDateFromLiterals } from '~/common/utils/dates';

/**
 * As unix millis
 */
export async function parseDateAndReplyToInvalid(ctx: Context, text?: string): Promise<number | undefined> {
  const messageText = text ?? ctx.message!.text;
  const [, argument] = messageText.split(' ');
  const date = parseDateFromLiterals(argument ?? 'today');
  if (date === undefined) {
    await ctx.reply(`❌ Unrecognized date: ${argument}`);
  }
  return date.getTime();
}

interface FindBookingsOptions {
  commandText?: string;
  messageReplyId?: number;
}

async function parseCommandFindBookingsAddedAfterAndReply(ctx: Context, _next, options?: FindBookingsOptions) {
  const date = await parseDateAndReplyToInvalid(ctx, options?.commandText);
  if (!date) {
    return;
  }

  const todayArrivals = await BookingsService.fetchBookingsAddedAfter(date);
  if (todayArrivals.length === 0) {
    await ctx.replyWithHTML(`No bookings that were added after ${formatDate(date, DATETIME_DAYOFWEEK_MOMENTJS)}`);
    return;
  }
  todayArrivals.forEach(async (booking) => {
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: (options?.messageReplyId ?? ctx.message?.message_id),
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
}

export default parseCommandFindBookingsAddedAfterAndReply;
