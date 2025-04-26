import { Telegraf } from 'telegraf';
import { botToken } from './config';
import registerAvailabilityHandlers from './handlers/availabilityHandlers';
import registerBookingHandlers from './handlers/bookingHandlers';
import registerSyncHandlers from './handlers/syncHandlers';
import { registerAdminHandlers } from './handlers/adminHandlers';
import { setupTelegramContextInterceptor } from './interceptors/TelegramContextInterceptor';

// Initialize the bot
const bot = new Telegraf(botToken);

// Set up the Telegram context interceptor for audit logging and ABAC
setupTelegramContextInterceptor();

// Set up commands description for Telegram UI
bot.telegram.setMyCommands([
  { command: 'booking', description: 'Получить информацию о бронировании по ID' },
  { command: 'sync', description: 'Запустить синхронизацию с PMS' },
  { command: 'syncstatus', description: 'Получить статус последней синхронизации' },
  { command: 'available', description: 'Поиск свободных номеров по дате, дням и гостям' },
  { command: 'reload_abac', description: 'Перезагрузить ABAC политики (только для админов)' },
  { command: 'help', description: 'Показать справку по командам' }
]);

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    'Доступные команды:\n\n'
    + '/booking <id> - Получить информацию о бронировании по ID\n'
    + '/sync - Запустить синхронизацию данных с PMS\n'
    + '/syncstatus - Получить статус последней синхронизации\n'
    + '/available <дата> <дни> <гости> - Поиск свободных номеров\n'
    + '  Пример: /available 2023-12-25 3 2\n'
    + '/reload_abac - Перезагрузить ABAC политики (только для админов)\n'
    + '/help - Показать это сообщение'
  );
});

// Register all handlers
registerBookingHandlers(bot);
registerSyncHandlers(bot);
registerAvailabilityHandlers(bot);
registerAdminHandlers(bot);

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}`, err);
  ctx.reply('Произошла ошибка при обработке запроса.');
});

export default bot;
