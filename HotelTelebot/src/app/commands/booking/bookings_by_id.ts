import { DetailedBooking, DetailedBookingActions } from '@components';
import { Context } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { BookingsService } from '~/api/services';

export async function fetchBookingByIdAndReply(bookingId: string, ctx: Context, extra?: ExtraReplyMessage) {
  const foundBooking = await BookingsService.fetchBookingById(bookingId);
  if (foundBooking) {
    return ctx.replyWithHTML(DetailedBooking(foundBooking), {
      reply_markup: { inline_keyboard: DetailedBookingActions(foundBooking) },
      ...extra
    });
  }
  return ctx.reply('🔍 Not found');
}

async function parseCommandFindBookingsByIdAndReply(ctx: Context) {
  const messageWords = ctx.message?.text?.split(' ');
  if (!messageWords || messageWords.length < 2) {
    return ctx.reply('❌ id missing ❌');
  }
  const [, bookingId] = messageWords;
  return fetchBookingByIdAndReply(bookingId, ctx);
}

export default parseCommandFindBookingsByIdAndReply;
