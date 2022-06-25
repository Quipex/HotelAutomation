/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { formatDate } from '~/common/utils/dates';
import { BookingService } from '~@services';
import { BriefBookingActions, ColorfulBooking } from '~@components';

type FindBookingsOptions = {
  commandText?: string;
  messageReplyId?: number;
};

type Args = {
  date: Date, options?: FindBookingsOptions
};

const findBookingsThatWereAddedAfterAndReply = async (ctx: Context, { options, date }: Args) => {
  const utcDate = formatDate(date);
  const todayArrivals = await BookingService.fetchBookingsAddedAfter(utcDate);
  if (todayArrivals.length === 0) {
    await ctx.replyWithHTML(
      `🔎 No bookings that were added after '${utcDate}'`,
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }

  const infoMsg = await ctx.replyWithHTML(
    `🔎 Found ${todayArrivals.length} bookings that were added after '${utcDate}'`,
    { reply_to_message_id: ctx.message.message_id }
  );

  for (const booking of todayArrivals) {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: (options?.messageReplyId ?? infoMsg.message_id),
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  }
};

export { findBookingsThatWereAddedAfterAndReply };
