/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { BriefBookingActions, ColorfulBooking } from '~@components';
import { BookingsService } from '~@services';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const replyWithNotMarkedLivingBookings: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, date] = cbPayloadArray;
  const arrivals = await BookingsService.fetchLivingButNotMarked(date);
  for (const booking of arrivals) {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: messageId,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  }
  await ctx.answerCbQuery();
};

export { replyWithNotMarkedLivingBookings };
