import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { npmExpired, npmNeedReminding, npmNotExpired, npmOverall } from '~@callbacks/domain/notPrepaidMenu/actions';

const NotPrepaidMenuActions = (): InlineKeyboardButton[][] => {
  const inlineKeyboard: InlineKeyboardButton[][] = [];

  inlineKeyboard.push([{
    text: 'Все неоплаченные 🔎',
    hide: false,
    callback_data: npmOverall
  }]);
  inlineKeyboard.push([{
    text: 'Напомнили, не оплатили за отведённое время 🤬',
    hide: false,
    callback_data: npmExpired
  }]);
  inlineKeyboard.push([{
    text: 'Напомнили, не оплатили, еще есть время ⏲',
    hide: false,
    callback_data: npmNotExpired
  }]);
  inlineKeyboard.push([{
    text: 'Надо напомнить оплатить ❗',
    hide: false,
    callback_data: npmNeedReminding
  }]);

  return inlineKeyboard;
};

export default NotPrepaidMenuActions;
