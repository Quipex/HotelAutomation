/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { Context } from 'telegraf';
import { sleep } from '~/common/utils/thread';
import appConfig from '~/config/appConfig';
import { Notification, NotificationActions } from '~@components';
import { BookingNotificationsService } from '~@services';

const replyWithUnreadNotifications = async (ctx: Context, originalMessageId?: number) => {
  const unreadNotifications = await BookingNotificationsService.getUnreadNotifications();
  const { message_id: messageId } = await ctx.reply(
    unreadNotifications.length ? 'Непрочитанные уведомления 🔔' : 'Все уведомления прочитаны ✅',
    { reply_to_message_id: ctx.message?.message_id ?? originalMessageId }
  );
  for (let i = 0; i < unreadNotifications.length; i += 1) {
    const notification = unreadNotifications[i];
    await ctx.replyWithHTML(Notification(notification), {
      reply_to_message_id: messageId,
      reply_markup: { inline_keyboard: NotificationActions(notification) }
    });
    if (i !== unreadNotifications.length - 1) {
      await sleep(appConfig.data.waitNotificationMs);
    }
  }
};

export { replyWithUnreadNotifications };
