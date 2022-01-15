import { Context } from 'telegraf';
import { ExtraSendMessage } from 'telegraf/typings/telegram-types';
import fetchBookingById from '../../../api/calls/fetchBookingById';
import DetailedBooking from '../../message_components/booking/DetailedBooking';
import detailedBookingActions from '../../message_components/booking/DetailedBookingActions';

export async function fetchBookingByIdAndReply(bookingId: string, ctx: Context, extra?: ExtraSendMessage) {
  const foundBooking = await fetchBookingById(bookingId);
  if (foundBooking) {
    return ctx.replyWithHTML(DetailedBooking(foundBooking), {
      reply_markup: { inline_keyboard: detailedBookingActions(foundBooking) },
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
