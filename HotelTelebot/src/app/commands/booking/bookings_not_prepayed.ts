import { Context } from 'telegraf';
import { BriefBooking, BriefBookingActions } from '@components';
import { BookingsService } from '~/api/services';
import { parseDateAndReplyToInvalid } from './bookings_added';

async function parseCommandFindBookingsNotPrePayedAndReply(ctx: Context, next) {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    next();
    return;
  }

  const notPrePayedBookings = await BookingsService.fetchNotPayedBookingsArriveAfter(date);
  notPrePayedBookings.forEach(async (booking) => {
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
}

export default parseCommandFindBookingsNotPrePayedAndReply;
