import { Notification } from '@components';
import { BookingNotificationsService } from '~/api/services';
import bot from '~/app/bot';
import localDb from '~/config/db';
import env from '~/config/env';
import { createSchedule } from '../schedule.helper';

const updateReminder = async () => {
  await localDb.read();
  const notifications = await BookingNotificationsService
    .getNotifications({ idAfter: localDb.data.lastNotificationId });

  if (notifications?.length === 0) {
    return;
  }

  notifications
    .forEach(async (notification) => {
      await bot.telegram.sendMessage(
        env.notificationChannelId,
        Notification(notification as any),
        { parse_mode: 'HTML' }
      );
    });

  localDb.data.lastNotificationId = notifications[0].id;
  await localDb.write();
};

createSchedule('0 */1 * * * *', updateReminder);
