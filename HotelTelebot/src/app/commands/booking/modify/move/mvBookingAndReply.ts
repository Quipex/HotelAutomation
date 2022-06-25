import { Context } from 'telegraf';
import { BookingService } from '~@services';

type Args = {
  bookingId: string,
  roomNumber: string,
  date: Date
};

async function mvBookingAndReply(ctx: Context, { bookingId, roomNumber, date }: Args) {
  await BookingService.moveBooking({ bookingId, roomNumber, date });
  await ctx.reply('Moved ✅', { reply_to_message_id: ctx.message?.message_id });
}

export { mvBookingAndReply };
