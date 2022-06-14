import { CallbackHandler } from '@callbacks/CallbackHandler';
import { ColorfulBooking, BriefBookingActions } from '@components';
import { BookingsService } from '@services';

const findClientBookings: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, clientId] = cbPayloadArray;
  const bookings = await BookingsService.fetchClientBookings(clientId);
  await ctx.answerCbQuery();
  await ctx.reply(`🔎 Found ${bookings.length} bookings`, { reply_to_message_id: messageId });
  bookings.forEach(async (booking) => {
    await ctx.replyWithHTML(ColorfulBooking(booking), {
      reply_to_message_id: messageId,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) }
    });
  });
};

export { findClientBookings };
