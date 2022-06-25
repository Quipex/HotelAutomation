import { Context } from 'telegraf';
import { NoteMenu, NoteMenuActions } from '~@components';
import { BookingService } from '~@services';

type Args = {
  bookingId: string,
  originalMessageId?: number
};

const entity = 'booking';
const fetchBookingNoteAndReply = async (ctx: Context, { bookingId, originalMessageId }: Args) => {
  const { notes } = await BookingService.getNote(bookingId);
  await ctx.replyWithHTML(NoteMenu(notes, { entity, entityId: bookingId }), {
    reply_to_message_id: originalMessageId,
    reply_markup: { inline_keyboard: NoteMenuActions(entity, bookingId) }
  });
};

export { fetchBookingNoteAndReply };
