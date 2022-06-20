import { BookingsService } from '~@services';
import { extractMessageId } from '~@callbacks/helpers';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { refreshBooking } from './refreshBooking';

const confirmLivingAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId, mIdWithPrefix] = cbPayloadArray;
  await BookingsService.confirmLiving(bookingId);
  await ctx.answerCbQuery('✅ Подтверждено');
  await ctx.deleteMessage(messageId);
  await refreshBooking({ ctx, cbPayloadArray, messageId: extractMessageId(mIdWithPrefix) });
};

export { confirmLivingAndReply };
