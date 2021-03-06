import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { formatDate } from '~/common/utils/dates';
import {
  cbPayloadDayAfter,
  cbPayloadDayBefore,
  cbPayloadNotMarkedLiving,
  cbPayloadRefreshDashboard,
  dashboardNotPrepaid,
  dashboardToday,
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
  inlineKeyboard.push([
    {
      text: '⬅ День назад',
      hide: false,
      callback_data: cbPayloadDayBefore(dateText)
    },
    {
      text: '🏠 Сегодня',
      callback_data: dashboardToday,
      hide: false
    },
    {
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
    text: '💰🚫 Без предоплаты...',
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
