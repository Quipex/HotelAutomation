import { BriefBooking, BriefBookingActions } from '@components';
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import bot from '~/app/bot';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate, parseDateFromLiterals } from '~/common/utils/dates';
import { parseDateAndReplyToInvalid } from './bookings_added';

async function parseCommandFindBookingsArrivedOnAndReply(ctx: Context) {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  const todayArrivals = await BookingsService.fetchBookingsArriveAt(date);
  if (todayArrivals.length === 0) {
    await ctx.replyWithHTML(`No bookings that arrive after ${formatDate(date, DATETIME_DAYOFWEEK_MOMENTJS)}`);
  }
  todayArrivals.forEach(async (booking) => {
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
}

async function parseCommandFindBookingsArrivedOnNotLivingAndSend(
  chatId: string,
  textDate: string,
  replyMessageId?: number
) {
  const date = parseDateFromLiterals(textDate);
  if (!date) {
    return;
  }

  const arrivals = await BookingsService.fetchBookingsArriveAtAndNotLiving(date);
  arrivals.forEach(async (booking) => {
    await bot.telegram.sendMessage(chatId, BriefBooking(booking), {
      reply_to_message_id: replyMessageId,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) },
      parse_mode: 'HTML'
    });
  });
}

export {
  parseCommandFindBookingsArrivedOnNotLivingAndSend,
  parseCommandFindBookingsArrivedOnAndReply
};
