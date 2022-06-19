import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { formatDate } from '~/common/utils/dates';
import {
  cbPayloadDayAfter,
  cbPayloadDayBefore,
  cbPayloadRefreshDashboard,
  dashboardNotMarkedLiving,
  dashboardNotPrepaid,
  dashboardUnreadNotifications
} from '~@callbacks/callback_actions';

const DashboardActions = (date: Date): InlineKeyboardButton[][] => {
  const dateText = formatDate(date);
  const inlineKeyboard: InlineKeyboardButton[][] = [];
  inlineKeyboard.push([{ text: '♻ Обновить', hide: false, callback_data: cbPayloadRefreshDashboard(dateText) }]);
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
    text: '🔔 Непрочитанные уведомления',
    hide: false,
    callback_data: dashboardUnreadNotifications
  }]);
  inlineKeyboard.push([{ text: '💰🚫 Без предоплаты', hide: false, callback_data: dashboardNotPrepaid }]);
  inlineKeyboard.push([{
    text: '🛌🚫 Не отмечены проживающими',
    hide: false,
    callback_data: dashboardNotMarkedLiving
  }]);
  return inlineKeyboard;
};

export default DashboardActions;
