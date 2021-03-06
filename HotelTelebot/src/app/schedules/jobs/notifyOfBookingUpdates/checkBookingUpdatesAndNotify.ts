/* eslint-disable no-await-in-loop */
import { BookingNotificationService } from '~/api/services';
import { sleep } from '~/common/utils/thread';
import appConfig from '~/config/appConfig';
import localDb from '~/config/localDb';
import { Notification, NotificationActions } from '~@components';
import { saveLastNotificationId } from './saveLastNotificationId';
import { sendNotificationMessage } from './sendNotificationMessage';

const checkBookingUpdatesAndNotify = async () => {
  await localDb.read();
  const notifications = await BookingNotificationService.getNotifications({
    idAfter: localDb.data.lastNotificationId
  });

  if (notifications?.length === 0) {
    return;
  }

  const lastIndex = notifications.length - 1;
  for (let i = 0; i < notifications.length; i += 1) {
    try {
      const notification = notifications[i];
      await sendNotificationMessage(Notification(notification), NotificationActions(notification));
      if (i !== lastIndex) {
        await sleep(appConfig.data.waitNotificationMs);
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

export { checkBookingUpdatesAndNotify };
