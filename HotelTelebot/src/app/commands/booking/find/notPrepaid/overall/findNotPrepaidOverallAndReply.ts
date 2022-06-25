/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { formatDate, getRelevantDateText } from '~/common/utils/dates';
import { DetailedBooking, DetailedBookingActions } from '~@components';
import { BookingService } from '~@services';

const findNotPrepaidOverallAndReply = async (ctx: Context, date = new Date(), originalMessageId?: number) => {
  const notPrePayedBookings = await BookingService.fetchNotPayedBookingsArriveAfter(formatDate(date));
  const dateText = `[${getRelevantDateText(date)}]`;
  const { message_id: statusId } = await ctx.reply(
    notPrePayedBookings.length
      ? `🔎 Предстоящие бронирования без предоплаты (все) ${dateText}`
      : `✅ Нет бронирований без предоплаты ${dateText}`,
    { reply_to_message_id: ctx.message?.message_id ?? originalMessageId }
  );
  for (const booking of notPrePayedBookings) {
    await ctx.replyWithHTML(DetailedBooking(booking), {
      reply_to_message_id: statusId,
      reply_markup: { inline_keyboard: DetailedBookingActions(booking) }
    });
  }
};

export { findNotPrepaidOverallAndReply };
