import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { BookingNotificationsService } from '~@services';

const cbReadBookingNotification: CallbackHandler = async ({ ctx, cbPayloadArray }) => {
  const [, notificationId] = cbPayloadArray;
  await BookingNotificationsService.readNotificationById(Number(notificationId));
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.answerCbQuery('Прочитано ✅');
};

export { cbReadBookingNotification };
