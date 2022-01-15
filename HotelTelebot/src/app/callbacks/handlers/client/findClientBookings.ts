import { Context } from 'telegraf';
import fetchClientBookings from '../../../../api/calls/fetchClientBookings';
import BriefBooking from '../../../message_components/booking/BriefBooking';
import briefBookingActions from '../../../message_components/booking/BriefBookingActions';

export async function findClientBookings(ctx: Context, clientId: string, originalMessageId?: number) {
  const bookings = await fetchClientBookings(clientId);
  await ctx.answerCbQuery();
  await ctx.reply(`🔎 Found ${bookings.length} bookings`, { reply_to_message_id: originalMessageId });
  // eslint-disable-next-line no-restricted-syntax
  for (const booking of bookings) {
    // we want to preserve the order of sent messages
    // eslint-disable-next-line no-await-in-loop
    await ctx.replyWithHTML(BriefBooking(booking), {
      reply_to_message_id: originalMessageId,
      reply_markup: { inline_keyboard: briefBookingActions(booking) }
    });
  }
}
