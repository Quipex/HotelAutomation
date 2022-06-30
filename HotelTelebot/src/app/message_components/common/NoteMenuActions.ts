import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { Entity } from '~/common/types';
import { cbPayloadBookingClearNote } from '~@callbacks/domain/booking/actions';
import { cbPayloadClientClearNote } from '~@callbacks/domain/client/actions';
import { cbPayloadCancel } from '~@callbacks/domain/general/actions';
import { cbPayloadRoomClearNote } from '~@callbacks/domain/room/actions';

const getActionsForEntity = (entity: Entity, id: string) => {
  switch (entity) {
    case 'client': {
      return { clearNote: cbPayloadClientClearNote(id) };
    }
    case 'booking': {
      return { clearNote: cbPayloadBookingClearNote(id) };
    }
    case 'room': {
      return { clearNote: cbPayloadRoomClearNote(id) };
    }
    default: {
      return { clearNote: cbPayloadCancel() };
    }
  }
};

const NoteMenuActions = (entity: Entity, id: string): InlineKeyboardButton[][] => {
  const inlineKeyboard: InlineKeyboardButton[][] = [];
  const { clearNote } = getActionsForEntity(entity, id);
  inlineKeyboard.push([{ text: 'Стереть 🧹', hide: true, callback_data: clearNote }]);
  inlineKeyboard.push([{ text: 'Закрыть', hide: true, callback_data: cbPayloadCancel() }]);
  return inlineKeyboard;
};

export default NoteMenuActions;
