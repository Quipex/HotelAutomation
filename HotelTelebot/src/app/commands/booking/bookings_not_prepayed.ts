import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { formatDate } from '~/common/utils/dates';
import { BriefBookingActions, ColorfulBooking } from '~@components';
// noinspection ES6PreferShortImport
import { parseDateAndReplyToInvalid } from './bookings_added';

const parseCommandFindBookingsNotPrePayedAndReply = async (ctx: Context, next) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    next();
    return;
  }

  const notPrePayedBookings = await BookingsService.fetchNotPayedBookingsArriveAfter(formatDate(date));
  notPrePayedBookings.forEach(async (booking) => {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
};

export { parseCommandFindBookingsNotPrePayedAndReply };
