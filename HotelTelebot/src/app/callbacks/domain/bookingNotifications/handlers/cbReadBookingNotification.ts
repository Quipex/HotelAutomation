import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { BookingNotificationService } from '~@services';

const cbReadBookingNotification: CallbackHandler = async ({ ctx, cbPayloadArray }) => {
  const [, notificationId] = cbPayloadArray;
  await BookingNotificationService.readNotificationById(Number(notificationId));
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.answerCbQuery('Прочитано ✅');
};

export { cbReadBookingNotification };
