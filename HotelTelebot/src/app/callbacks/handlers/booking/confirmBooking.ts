import { CallbackHandler } from '@callbacks/CallbackHandler';
import { extractMessageId } from '@callbacks/handlers';
import { BookingsService } from '~/api/services';
import { refreshBooking } from './refreshBooking';

const confirmBookingAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId, mIdWithPrefix] = cbPayloadArray;
  await BookingsService.confirmBooking(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(messageId);
  await refreshBooking({ ctx, cbPayloadArray, messageId: extractMessageId(mIdWithPrefix) });
};

export { confirmBookingAndReply };
