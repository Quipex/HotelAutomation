import { InlineKeyboardButton } from 'telegraf/typings/markup';
import bot from '~/app/bot';
import env from '~/config/env';

const sendNotificationMessage = (notificationText: string, inlineKeyboard: InlineKeyboardButton[][]) => {
  return bot.telegram.sendMessage(
    env.notificationChannelId,
    notificationText,
    { parse_mode: 'HTML', reply_markup: { inline_keyboard: inlineKeyboard } }
  );
};

export { sendNotificationMessage };
