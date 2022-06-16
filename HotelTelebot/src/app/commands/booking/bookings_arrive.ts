/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { BriefBookingActions, ColorfulBooking } from '@components';
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';
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
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
}

export {
  parseCommandFindBookingsArrivedOnAndReply
};
