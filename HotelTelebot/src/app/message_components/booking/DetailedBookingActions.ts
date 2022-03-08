import { InlineKeyboardButton } from 'telegraf/typings/markup';
import PmsBookingEntity from '../../../api/entities/PmsBookingEntity';
import {
  textBookingLivingAsk,
  textBookingMoveList,
  textBookingPrepaidAsk,
  textBookingRefresh,
  textBookingRemindedPrepayment,
  textClientDetails
} from '@callbacks/callback_actions';

function detailedBookingActions({ id, status, startDate, customerId }: PmsBookingEntity) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{ text: 'Переместить... 🚪', callback_data: textBookingMoveList(id) }]);
  inlineKeyboard.push([{ text: 'Обновить ♻', callback_data: textBookingRefresh(id) }]);
  inlineKeyboard.push([{ text: 'Клиент 🧑️', callback_data: textClientDetails(customerId) }]);

  if (status === 'BOOKING_FREE') {
    inlineKeyboard.push([{ text: 'Подтвердить предоплату ✅', callback_data: textBookingPrepaidAsk(id) }]);
    inlineKeyboard.push([{ text: 'Напомнили за предоплату 💬', callback_data: textBookingRemindedPrepayment(id) }]);
  }

  if ((status === 'BOOKING_FREE' || status === 'BOOKING_WARRANTY') && (new Date() > new Date(startDate))) {
    inlineKeyboard.push([{ text: 'Подтвердить проживание 🏠', callback_data: textBookingLivingAsk(id) }]);
  }

  return inlineKeyboard;
}

export default detailedBookingActions;
