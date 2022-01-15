import { Context } from 'telegraf';
import fetchNotPayedBookingsArriveAfter from '../../../api/calls/fetchNotPayedBookingsArriveAfter';
import BriefBooking from '../../message_components/booking/BriefBooking';
import briefBookingActions from '../../message_components/booking/BriefBookingActions';
import { parseDateAndReplyToInvalid } from './bookings_added';

async function parseCommandFindBookingsNotPrePayedAndReply(ctx: Context, next) {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    next();
    return;
  }

  const notPrePayedBookings = await fetchNotPayedBookingsArriveAfter(date);
  notPrePayedBookings.forEach(async (booking) => {
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: briefBookingActions(booking) }
    });
  });
}

export default parseCommandFindBookingsNotPrePayedAndReply;
