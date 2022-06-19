import { Context } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { BookingsService } from '~/api/services';
import { DetailedBooking, DetailedBookingActions } from '~@components';

const fetchBookingByIdAndReply = async (bookingId: string, ctx: Context, extra?: ExtraReplyMessage) => {
  const foundBooking = await BookingsService.fetchBookingById(bookingId);
  if (!foundBooking) {
    return ctx.reply(`🔍 Not found booking with id '${bookingId}'`);
  }
  return ctx.replyWithHTML(DetailedBooking(foundBooking), {
    reply_markup: { inline_keyboard: DetailedBookingActions(foundBooking) },
    ...extra
  });
};

const parseCommandFindBookingsByIdAndReply = async (ctx: Context) => {
  const messageWords = ctx.message?.text?.split(' ');
  if (!messageWords || messageWords.length < 2) {
    return ctx.reply('Id missing ❌');
  }
  const [, bookingId] = messageWords;
  return fetchBookingByIdAndReply(bookingId, ctx);
};

export { fetchBookingByIdAndReply, parseCommandFindBookingsByIdAndReply };
