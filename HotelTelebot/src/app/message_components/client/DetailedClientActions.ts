import { cbPayloadClientBookings, cbPayloadClientRefresh } from '@callbacks/callback_actions';
import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { ClientDto } from '~/common/types';

function detailedClientActions({ id }: ClientDto) {
  const actions: InlineKeyboardButton[][] = [];

  actions.push([{ text: 'Бронирования 🚪', callback_data: cbPayloadClientBookings(id), hide: false }]);
  actions.push([{ text: 'Обновить ♻', callback_data: cbPayloadClientRefresh(id), hide: true }]);

  return actions;
}

export default detailedClientActions;
