import { InlineKeyboardButton } from 'telegraf/typings/markup';
import PmsClientEntity from '../../../api/entities/PmsClientEntity';
import { textClientDetails } from '../../callbacks/callback_actions';
import detailedClientActions from './DetailedClientActions';

function briefClientActions(client: PmsClientEntity) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{ text: 'Подробнее 🔍', callback_data: textClientDetails(client.id) }]);

  return [...inlineKeyboard, ...detailedClientActions(client)];
}

export default briefClientActions;
