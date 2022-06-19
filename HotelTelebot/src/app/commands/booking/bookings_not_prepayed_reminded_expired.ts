import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { BriefBookingActions, ColorfulBooking } from '~@components';

const findBookingsRemindedAndExpiredPrepayment = async (ctx: Context) => {
  const expiredBookings = await BookingsService.fetchBookingsExpiredAndReminded();
  expiredBookings.forEach(async (booking) => {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
};

export { findBookingsRemindedAndExpiredPrepayment };
