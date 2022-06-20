import env from '~/config/env';
import bot from '~/app/bot';

const sendNotificationMessage = (notificationText: string) => {
  return bot.telegram.sendMessage(
    env.notificationChannelId,
    notificationText,
    { parse_mode: 'HTML' }
  );
};

export { sendNotificationMessage };
