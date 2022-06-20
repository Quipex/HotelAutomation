import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { BookingNotificationDto } from '~/common/types';
import { cbPayloadBnRead } from '~@callbacks/domain/bookingNotifications/actions';

const NotificationActions = (notification: BookingNotificationDto): InlineKeyboardButton[][] => {
  const inlineKeyboard: InlineKeyboardButton[][] = [];
  inlineKeyboard.push([{
    text: '👀 Пометить как прочитанное',
    hide: true,
    callback_data: cbPayloadBnRead(notification.id)
  }]);
  return inlineKeyboard;
};

export default NotificationActions;
