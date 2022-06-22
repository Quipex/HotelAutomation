/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { formatDate, getRelevantDateText } from '~/common/utils/dates';
import { BriefBookingActions, ColorfulBooking } from '~@components';
import { BookingsService } from '~@services';

const replyWithNotPrepaidRemindedNotExpired = async (ctx: Context, date = new Date(), originalMessageId?: number) => {
  const notPrePayedBookings = await BookingsService.fetchNotPayedBookingsArriveAfter(formatDate(date), true, false);
  const dateText = `[${getRelevantDateText(date)}]`;
  const { message_id: statusId } = await ctx.reply(
    notPrePayedBookings.length
      ? `🔎 Предстоящие бронирования без предоплаты (напомнил, но не оплатили и еще есть время для оплаты ⏲) ${dateText}`
      : `✅ Нет бронирований без предоплаты, которым напомнили, но не оплатили и еще есть время для оплаты ${dateText}`,
    { reply_to_message_id: ctx.message?.message_id ?? originalMessageId }
  );
  for (const booking of notPrePayedBookings) {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: statusId,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  }
};

export { replyWithNotPrepaidRemindedNotExpired };
