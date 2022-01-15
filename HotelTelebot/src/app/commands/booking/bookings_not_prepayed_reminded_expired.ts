import { Context } from 'telegraf';
import fetchBookingsExpiredAndReminded from '../../../api/calls/fetchBookingsExpiredAndReminded';
import BriefBooking from '../../message_components/booking/BriefBooking';
import briefBookingActions from '../../message_components/booking/BriefBookingActions';

async function findBookingsRemindedAndExpiredPrepayment(ctx: Context) {
  const expiredBookings = await fetchBookingsExpiredAndReminded();
  expiredBookings.forEach(async (booking) => {
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: briefBookingActions(booking) }
    });
  });
}

export default findBookingsRemindedAndExpiredPrepayment;
