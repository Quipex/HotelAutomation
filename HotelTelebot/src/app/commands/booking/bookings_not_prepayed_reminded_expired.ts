import { ColorfulBooking, BriefBookingActions } from '@components';
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';

async function findBookingsRemindedAndExpiredPrepayment(ctx: Context) {
  const expiredBookings = await BookingsService.fetchBookingsExpiredAndReminded();
  expiredBookings.forEach(async (booking) => {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
}

export default findBookingsRemindedAndExpiredPrepayment;
