import { InlineKeyboardButton } from 'telegraf/typings/markup';
import PmsBookingEntity from '../../../api/entities/PmsBookingEntity';
import { textBookingDetails } from '../../callbacks/callback_actions';
import detailedBookingActions from './DetailedBookingActions';

function briefBookingActions(booking: PmsBookingEntity) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{ text: 'Подробнее 🔍', callback_data: textBookingDetails(booking.id) }]);

  return [...inlineKeyboard, ...detailedBookingActions(booking)];
}

export default briefBookingActions;
