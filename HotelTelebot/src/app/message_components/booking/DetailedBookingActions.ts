import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { SOURCES_MANUAL_CREATION } from '~/common/constants';
import { BookingDto } from '~/common/types';
import {
  cbPayloadBookingCancelAsk,
  cbPayloadBookingLivingAsk,
  cbPayloadBookingMoveList,
  cbPayloadBookingPrepaidAsk,
  cbPayloadBookingRefresh,
  cbPayloadBookingRemindedPrepayment,
  cbPayloadBookingShowNote
} from '~@callbacks/domain/booking/actions';
import { cbPayloadClientDetails } from '~@callbacks/domain/client/actions';
import { cbPayloadRoomDetails } from '~@callbacks/domain/room/actions';

function detailedBookingActions(
  {
    id: bookingId,
    cancelled,
    living,
    prepaid,
    client: { id: clientId },
    startDate,
    source,
    room: { realRoomNumber }
  }: BookingDto
) {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([
    { text: 'Переместить... 📦', callback_data: cbPayloadBookingMoveList(bookingId), hide: false }
  ]);
  inlineKeyboard.push([{ text: 'Обновить ♻', callback_data: cbPayloadBookingRefresh(bookingId), hide: true }]);
  inlineKeyboard.push([
    { text: 'Комната 🚪', callback_data: cbPayloadRoomDetails(realRoomNumber.toString()), hide: true }
  ]);
  inlineKeyboard.push([{ text: 'Клиент 🧑️', callback_data: cbPayloadClientDetails(clientId), hide: false }]);
  inlineKeyboard.push([{ text: 'Заметки 📝', callback_data: cbPayloadBookingShowNote(bookingId), hide: false }]);

  if (cancelled) {
    return inlineKeyboard;
  }

  if (SOURCES_MANUAL_CREATION.includes(source)) {
    inlineKeyboard.push([{ text: 'Отменить ❌', callback_data: cbPayloadBookingCancelAsk(bookingId), hide: false }]);
  }

  if (!prepaid && !living) {
    inlineKeyboard.push([{
      text: 'Подтвердить предоплату... ✅',
      callback_data: cbPayloadBookingPrepaidAsk(bookingId),
      hide: true
    }]);
    inlineKeyboard.push([{
      text: 'Напомнили про предоплату 💬',
      callback_data: cbPayloadBookingRemindedPrepayment(bookingId),
      hide: false
    }]);
  }

  const shouldBeLiving = new Date() > new Date(startDate);

  if (shouldBeLiving && !living) {
    inlineKeyboard.push([{
      text: 'Подтвердить проживание... 🏠',
      callback_data: cbPayloadBookingLivingAsk(bookingId),
      hide: true
    }]);
  }

  return inlineKeyboard;
}

export default detailedBookingActions;
