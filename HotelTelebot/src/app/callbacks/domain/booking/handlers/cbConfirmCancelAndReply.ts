import { BookingsService } from '~@services';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { extractMessageId } from '~@callbacks/helpers';
import { cbRefreshBooking } from './cbRefreshBooking';

const cbConfirmCancelAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId, mIdWithPrefix] = cbPayloadArray;
  await BookingsService.cancelBooking(bookingId);
  await ctx.answerCbQuery('✅ Отменено');
  await ctx.deleteMessage(messageId);
  await cbRefreshBooking({ ctx, cbPayloadArray, messageId: extractMessageId(mIdWithPrefix) });
};

export { cbConfirmCancelAndReply };
