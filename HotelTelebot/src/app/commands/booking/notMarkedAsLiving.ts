/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { getRelevantDateText } from '~/common/utils/dates';
import { DetailedBooking, DetailedBookingActions } from '~@components';
import { BookingsService } from '~@services';

const replyNotMarkedAsLiving = async (ctx: Context, date: string, originalMessageId?: number) => {
  const arrivals = await BookingsService.fetchLivingButNotMarked(date);
  const relevantDateText = getRelevantDateText(new Date(date));
  const { message_id: titleId } = await ctx.reply(
    arrivals.length
      ? `🛌🚫 Не отмечены проживающими ${relevantDateText}`
      : `${relevantDateText} нет неотмеченных проживающих ✅`,
    { reply_to_message_id: originalMessageId }
  );
  for (const booking of arrivals) {
    await ctx.replyWithHTML(DetailedBooking(booking), {
      reply_to_message_id: titleId,
      reply_markup: { inline_keyboard: DetailedBookingActions(booking) }
    });
  }
};

export { replyNotMarkedAsLiving };
