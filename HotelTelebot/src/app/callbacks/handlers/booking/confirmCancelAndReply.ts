import { BookingsService } from '~/api/services';
import { CallbackHandler } from '../../CallbackHandler';
import { extractMessageId } from '../general';
import { refreshBooking } from './refreshBooking';

const confirmCancelAndReply: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, bookingId, mIdWithPrefix] = cbPayloadArray;
  await BookingsService.cancelBooking(bookingId);
  await ctx.answerCbQuery('✅ Отменено');
  await ctx.deleteMessage(messageId);
  await refreshBooking({ ctx, cbPayloadArray, messageId: extractMessageId(mIdWithPrefix) });
};

export { confirmCancelAndReply };
