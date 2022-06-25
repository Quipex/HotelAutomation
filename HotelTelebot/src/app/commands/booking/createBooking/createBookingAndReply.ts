import { Context } from 'telegraf';
import { BookingService } from '~@services';

type Args = {
  fromDate: Date,
  toDate: Date,
  roomNumber: string,
  guestName: string
};

async function createBookingAndReply(ctx: Context, { fromDate, toDate, roomNumber, guestName }: Args) {
  const { newId } = await BookingService.createBooking({
    from: fromDate, to: toDate, roomNumber, guestName
  }) as any;
  await ctx.replyWithHTML(`Created ✅ <code>/id ${newId}</code>`, {
    reply_to_message_id: ctx.message?.message_id
  });
}

export { createBookingAndReply };
