import { Context } from 'telegraf';
import { fetchBookingByIdAndReply } from '../../../commands/booking/bookings_by_id';

export async function sendBookingDetails(ctx: Context, id: string, message_id?: number) {
  await fetchBookingByIdAndReply(id, ctx, { reply_to_message_id: message_id });
  await ctx.answerCbQuery();
}
