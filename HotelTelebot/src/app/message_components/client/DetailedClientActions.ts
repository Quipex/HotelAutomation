import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { ClientDto } from '~/common/types';
import {
  cbPayloadClientBookings,
  cbPayloadClientRefresh,
  cbPayloadClientShowNote
} from '~@callbacks/domain/client/actions';

function detailedClientActions({ id }: ClientDto) {
  const actions: InlineKeyboardButton[][] = [];

  actions.push([{ text: 'Бронирования 🚪', callback_data: cbPayloadClientBookings(id), hide: false }]);
  actions.push([{ text: 'Обновить ♻', callback_data: cbPayloadClientRefresh(id), hide: true }]);
  actions.push([{ text: 'Заметки 📝', callback_data: cbPayloadClientShowNote(id), hide: true }]);

  return actions;
}

export default detailedClientActions;
