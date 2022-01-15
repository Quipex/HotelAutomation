import { InlineKeyboardButton } from 'telegraf/typings/markup';
import PmsClientEntity from '../../../api/entities/PmsClientEntity';
import { textClientBookings, textClientRefresh } from '../../callbacks/callback_actions';

function detailedClientActions({ id }: PmsClientEntity) {
  const actions: InlineKeyboardButton[][] = [];

  actions.push([{ text: 'Бронирования 🚪', callback_data: textClientBookings(id) }]);
  actions.push([{ text: 'Обновить ♻', callback_data: textClientRefresh(id) }]);

  return actions;
}

export default detailedClientActions;
