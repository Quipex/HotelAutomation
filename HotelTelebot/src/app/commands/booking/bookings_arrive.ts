/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { formatDate } from '~/common/utils/dates';
import { BriefBookingActions, ColorfulBooking } from '~@components';
// noinspection ES6PreferShortImport
import { parseDateAndReplyToInvalid } from './bookings_added';

const parseCommandFindBookingsArrivedOnAndReply = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  const utcDate = formatDate(date);
  const todayArrivals = await BookingsService.fetchBookingsArriveAt(utcDate);
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
  todayArrivals.forEach(async (booking) => {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: infoMsg.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
};

export {
  parseCommandFindBookingsArrivedOnAndReply
};
