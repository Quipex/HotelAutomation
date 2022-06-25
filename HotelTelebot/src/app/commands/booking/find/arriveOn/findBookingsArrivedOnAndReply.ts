/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { formatDate } from '~/common/utils/dates';
import { BriefBookingActions, ColorfulBooking } from '~@components';
import { BookingService } from '~@services';

async function findBookingsArrivedOnAndReply(ctx: Context, date: Date) {
  const utcDate = formatDate(date);
  const todayArrivals = await BookingService.fetchBookingsArriveAt(utcDate);
  if (todayArrivals.length === 0) {
    await ctx.replyWithHTML(
      `🔎 No bookings that arrive on '${utcDate}'`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const infoMsg = await ctx.replyWithHTML(
    `🔎 Found ${todayArrivals.length} bookings that arrived on '${utcDate}'`,
    { reply_to_message_id: ctx.message.message_id }
  );
  for (const booking of todayArrivals) {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: infoMsg.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  }
}

export { findBookingsArrivedOnAndReply };
