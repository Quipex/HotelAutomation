import { Telegraf, Context } from 'telegraf';
import { api } from '../api';
import { formatSyncStatus } from '../formatter';

/**
 * Register sync related handlers
 */
export function registerSyncHandlers(bot: Telegraf) {
  // Handler for '/sync' command - trigger manual sync
  bot.command('sync', async (ctx) => {
    try {
      // Send initial message
      await ctx.reply('Синхронизация запущена...');

      // Call backend sync API
      const response = await api.syncData();

      if (response.data === 'ok' || response.status === 200) {
        await ctx.reply('Синхронизация успешно выполнена');
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Error during sync:', error);
      await ctx.reply('Произошла ошибка при синхронизации. Пожалуйста, попробуйте позже.');
    }
  });

  // Handler for '/syncstatus' command - get last sync info
  bot.command('syncstatus', async (ctx) => {
    try {
      // Get sync status from backend
      const response = await api.get('/sync/status');
      await ctx.replyWithMarkdown(formatSyncStatus(response.data));
    } catch (error) {
      console.error('Error fetching sync status:', error);
      await ctx.reply('Не удалось получить статус синхронизации. Пожалуйста, попробуйте позже.');
    }
  });
}

export default registerSyncHandlers;
