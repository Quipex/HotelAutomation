import { BookingsService } from '~@services';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { extractMessageId } from '~@callbacks/helpers';
import { cbRefreshBooking } from './cbRefreshBooking';

const confirmBookingAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId, mIdWithPrefix] = cbPayloadArray;
  await BookingsService.confirmPrepayment(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(messageId);
  await cbRefreshBooking({ ctx, cbPayloadArray, messageId: extractMessageId(mIdWithPrefix) });
};

export { confirmBookingAndReply };
