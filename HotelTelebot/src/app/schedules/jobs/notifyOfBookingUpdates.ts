/* eslint-disable no-await-in-loop */
import { BookingNotificationsService } from '~/api/services';
import bot from '~/app/bot';
import { sleep } from '~/common/utils/thread';
import localDb from '~/config/db';
import env from '~/config/env';
import { Notification } from '~@components';
import { createSchedule } from '../schedule.helper';

const saveLastNotificationId = async (id: number) => {
  localDb.data.lastNotificationId = id;
  await localDb.write();
};

const sendNotificationMessage = (notificationText: string) => {
  return bot.telegram.sendMessage(
    env.notificationChannelId,
    notificationText,
    { parse_mode: 'HTML' }
  );
};

const checkBookingUpdatesAndNotify = async () => {
  await localDb.read();
  const notifications = await BookingNotificationsService.getNotifications({
    idAfter: localDb.data.lastNotificationId
  });

  if (notifications?.length === 0) {
    return;
  }

  const lastIndex = notifications.length - 1;
  for (let i = 0; i < notifications.length; i += 1) {
    try {
      await sendNotificationMessage(Notification(notifications[i]));
      if (i !== lastIndex) {
        await sleep(500);
      }
    } catch (e) {
      if (i > 0) {
        const previousSuccessfulNotificationId = notifications[i - 1].id;
        await saveLastNotificationId(previousSuccessfulNotificationId);
      }
      throw e;
    }
  }

  const lastNotificationId = notifications[lastIndex].id;
  await saveLastNotificationId(lastNotificationId);
};

// every minute
createSchedule('0 */1 * * * *', checkBookingUpdatesAndNotify);
