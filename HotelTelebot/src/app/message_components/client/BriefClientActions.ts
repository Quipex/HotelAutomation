import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { textClientDetails } from '@callbacks/callback_actions';
import { ClientDto } from '~/common/types';
import detailedClientActions from './DetailedClientActions';

function briefClientActions(client: ClientDto) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{ text: 'Подробнее 🔍', callback_data: textClientDetails(client.id), hide: false }]);

  return [...inlineKeyboard, ...detailedClientActions(client)];
}

export default briefClientActions;
