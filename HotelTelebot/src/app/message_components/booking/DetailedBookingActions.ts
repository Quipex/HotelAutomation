import {
  cbPayloadBookingLivingAsk,
  cbPayloadBookingMoveList,
  cbPayloadBookingPrepaidAsk,
  cbPayloadBookingRefresh,
  cbPayloadBookingRemindedPrepayment,
  cbPayloadClientDetails
} from '@callbacks/callback_actions';
import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { BookingDto } from '~/common/types';

function detailedBookingActions(
  { id, cancelled, living, prepaid, client: { id: clientId }, startDate }: BookingDto
) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{ text: 'Переместить... 🚪', callback_data: cbPayloadBookingMoveList(id), hide: false }]);
  inlineKeyboard.push([{ text: 'Обновить ♻', callback_data: cbPayloadBookingRefresh(id), hide: true }]);
  inlineKeyboard.push([{ text: 'Клиент 🧑️', callback_data: cbPayloadClientDetails(clientId), hide: false }]);

  if (cancelled) {
    return inlineKeyboard;
  }

  if (!prepaid && !living) {
    inlineKeyboard.push([{
      text: 'Подтвердить предоплату ✅',
      callback_data: cbPayloadBookingPrepaidAsk(id),
      hide: true
    }]);
    inlineKeyboard.push([{
      text: 'Напомнили за предоплату 💬',
      callback_data: cbPayloadBookingRemindedPrepayment(id),
      hide: false
    }]);
  }

  const shouldBeLiving = new Date() > new Date(startDate);

  if (shouldBeLiving && !living) {
    inlineKeyboard.push([{
      text: 'Подтвердить проживание 🏠',
      callback_data: cbPayloadBookingLivingAsk(id),
      hide: true
    }]);
  }

  return inlineKeyboard;
}

export default detailedBookingActions;
