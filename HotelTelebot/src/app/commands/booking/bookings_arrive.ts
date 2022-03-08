/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import bot from '~/app/bot';
import { parseDateAsUnix } from '~/utils/dates.helper';
import BriefBooking from '../../message_components/booking/BriefBooking';
import briefBookingActions from '../../message_components/booking/BriefBookingActions';
import { parseDateAndReplyToInvalid } from './bookings_added';

async function parseCommandFindBookingsArrivedOnAndReply(ctx: Context, next) {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    await next();
    return;
  }

  const todayArrivals = await BookingsService.fetchBookingsArriveAt(date);
  todayArrivals.forEach(async (booking) => {
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: briefBookingActions(booking) }
    });
  });
}

async function parseCommandFindBookingsArrivedOnNotLivingAndSend(
  chatId: string,
  textDate: string,
  replyMessageId?: number
) {
  const date = parseDateAsUnix(textDate);
  if (!date) {
    return;
  }

  const arrivals = await BookingsService.fetchBookingsArriveAtAndNotLiving(date);
  arrivals.forEach(async (booking) => {
    await bot.telegram.sendMessage(chatId, BriefBooking(booking), {
      reply_to_message_id: replyMessageId,
      reply_markup: { inline_keyboard: briefBookingActions(booking) },
      parse_mode: 'HTML'
    });
  });
}

export {
  parseCommandFindBookingsArrivedOnNotLivingAndSend,
  parseCommandFindBookingsArrivedOnAndReply
};
