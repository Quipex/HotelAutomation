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

async function parseBookingIdAndReplyInvalid(ctx: Context): Promise<string | undefined> {
  const messageText = ctx.message?.text;
  if (!messageText || messageText.split(' ').length <= 1) {
    await ctx.reply('❌ id missing ❌');
    return undefined;
  }
  return messageText.split(' ')[1];
}

async function parseCommandFindBookingsByIdAndReply(ctx: Context, next) {
  const bookingId = await parseBookingIdAndReplyInvalid(ctx);
  if (!bookingId) {
    return next();
  }
  return fetchBookingByIdAndReply(bookingId, ctx);
}

export default parseCommandFindBookingsByIdAndReply;
