import { BookingService } from '~@services';
import { extractMessageId } from '~@callbacks/helpers';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { cbRefreshBooking } from './cbRefreshBooking';

const confirmLivingAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId, mIdWithPrefix] = cbPayloadArray;
  await BookingService.confirmLiving(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(messageId);
  await cbRefreshBooking({ ctx, cbPayloadArray, messageId: extractMessageId(mIdWithPrefix) });
};

export { confirmLivingAndReply };
