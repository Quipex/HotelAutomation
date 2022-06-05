import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { textBookingDetails } from '@callbacks/callback_actions';
import { BookingDto } from '~/common/types';
import detailedBookingActions from './DetailedBookingActions';

function briefBookingActions(booking: BookingDto) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{ text: 'Подробнее 🔍', callback_data: textBookingDetails(booking.id), hide: true }]);

  return [...inlineKeyboard, ...detailedBookingActions(booking)];
}

export default briefBookingActions;
