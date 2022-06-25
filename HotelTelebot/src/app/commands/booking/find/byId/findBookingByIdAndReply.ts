import { Context } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { BookingService } from '~@services';
import { DetailedBooking, DetailedBookingActions } from '~@components';

const findBookingByIdAndReply = async (bookingId: string, ctx: Context, extra?: ExtraReplyMessage) => {
  const foundBooking = await BookingService.fetchBookingById(bookingId);
  if (!foundBooking) {
    return ctx.reply(`🔍 Not found booking with id '${bookingId}'`);
  }
  return ctx.replyWithHTML(DetailedBooking(foundBooking), {
    reply_markup: { inline_keyboard: DetailedBookingActions(foundBooking) },
    ...extra
  });
};

export { findBookingByIdAndReply };
