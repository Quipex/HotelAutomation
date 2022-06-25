import { Context } from 'telegraf';
import { COMMAND_BOOKING_BY_ID } from '~/common/constants';
import { BookingService } from '~@services';

type Args = {
  bookingId: string,
  noteText: string
};

const setBookingNoteAndReply = async (ctx: Context, { noteText, bookingId }: Args) => {
  await BookingService.setNote(bookingId, noteText);
  await ctx.replyWithHTML(`Заметка о <code>/${COMMAND_BOOKING_BY_ID} ${bookingId}</code> обновлена ✅`);
};

export { setBookingNoteAndReply };
