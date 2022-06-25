import { Context } from 'telegraf';
import { BookingService } from '~@services';

type RoomToDays = { room: string, days: string };

type Args = {
  bookingId: string,
  roomsToDays: RoomToDays[]
};

const mvBookingInBatchAndReply = async (ctx: Context, { bookingId, roomsToDays }: Args) => {
  const reportPlan = await BookingService.moveBookingInBatch({ bookingId, roomsToDays });
  await ctx.replyWithHTML(
    `Moved ✅\n<code>${JSON.stringify(reportPlan, null, 2)}</code>`,
    { reply_to_message_id: ctx.message?.message_id }
  );
};

export type { RoomToDays };

export { mvBookingInBatchAndReply };
