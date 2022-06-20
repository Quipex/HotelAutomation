import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { formatDate } from '~/common/utils/dates';
import {
  cbPayloadDayAfter,
  cbPayloadDayBefore,
  cbPayloadNotMarkedLiving,
  cbPayloadRefreshDashboard,
  dashboardNotPrepaid,
  dashboardUnreadNotifications
} from '~@callbacks/domain/dashboard/actions';

const DashboardActions = (date: Date): InlineKeyboardButton[][] => {
  const dateText = formatDate(date);
  const inlineKeyboard: InlineKeyboardButton[][] = [];
  inlineKeyboard.push([{
    text: '♻ Синхронизировать',
    hide: false,
    callback_data: cbPayloadRefreshDashboard(dateText)
  }]);
  inlineKeyboard.push([{
    text: '⬅ День назад',
    hide: false,
    callback_data: cbPayloadDayBefore(dateText)
  }, {
    text: 'День вперёд ➡',
    hide: false,
    callback_data: cbPayloadDayAfter(dateText)
  }]);
  inlineKeyboard.push([{
    text: '🔔 Непрочитанные уведомления (сегодня)',
    hide: false,
    callback_data: dashboardUnreadNotifications
  }]);
  inlineKeyboard.push([{
    text: '💰🚫 Без предоплаты (сегодня)',
    hide: false,
    callback_data: dashboardNotPrepaid
  }]);
  inlineKeyboard.push([{
    text: '🛌🚫 Не отмечены проживающими',
    hide: false,
    callback_data: cbPayloadNotMarkedLiving(dateText)
  }]);
  return inlineKeyboard;
};

export default DashboardActions;
