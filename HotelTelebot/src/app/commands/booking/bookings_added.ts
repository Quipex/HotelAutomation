import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { formatDate, parseDateFromLiterals } from '~/common/utils/dates';
import { BriefBookingActions, ColorfulBooking } from '~@components';

/**
 * As unix millis
 */
const parseDateAndReplyToInvalid = async (ctx: Context, text?: string): Promise<Date | null> => {
  const messageText = text ?? ctx.message!.text;
  const [, argument] = messageText.split(' ');
  const date = parseDateFromLiterals(argument ?? 'today');
  if (!date) {
    await ctx.reply(`❌ Unrecognized date: ${argument}`);
  }
  return date;
};

interface FindBookingsOptions {
  commandText?: string;
  messageReplyId?: number;
}

const parseCommandFindBookingsAddedAfterAndReply = async (ctx: Context, _next, options?: FindBookingsOptions) => {
  const date = await parseDateAndReplyToInvalid(ctx, options?.commandText);
  if (!date) {
    return;
  }

  const utcDate = formatDate(date);
  const todayArrivals = await BookingsService.fetchBookingsAddedAfter(utcDate);
  if (todayArrivals.length === 0) {
    await ctx.replyWithHTML(
      `🔎 No bookings that were added after '${utcDate}'`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const infoMsg = await ctx.replyWithHTML(
    `🔎 Found ${todayArrivals.length} bookings that were added after '${utcDate}'`,
    { reply_to_message_id: ctx.message.message_id }
  );

  todayArrivals.forEach(async (booking) => {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: (options?.messageReplyId ?? infoMsg.message_id),
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
};

export { parseCommandFindBookingsAddedAfterAndReply, parseDateAndReplyToInvalid };
