import { Context, Telegraf } from 'telegraf';
import { api } from '../api';
import { formatAvailableRooms } from '../formatter';

/**
 * Register availability related handlers
 */
export function registerAvailabilityHandlers(bot: Telegraf<Context>) {
  // Handler for '/available <date> <days> <guests>' command
  bot.command('available', async (ctx) => {
    try {
      const args = ctx.message.text.split(' ');
      if (args.length < 4) {
        return ctx.reply(
          'Пожалуйста, укажите дату, количество дней и количество гостей. '
          + 'Пример: /available 2023-12-25 3 2'
        );
      }

      // Parse arguments
      const date = args[1];
      const days = parseInt(args[2], 10);
      const guests = parseInt(args[3], 10);

      // Validate arguments
      if (isNaN(days) || days <= 0) {
        return ctx.reply('Количество дней должно быть положительным числом.');
      }

      if (isNaN(guests) || guests <= 0) {
        return ctx.reply('Количество гостей должно быть положительным числом.');
      }

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return ctx.reply('Дата должна быть в формате YYYY-MM-DD, например: 2023-12-25');
      }

      // Get available rooms from backend
      const response = await api.getAvailableRooms(date, days, guests);

      // Format and send the response
      await ctx.replyWithMarkdown(formatAvailableRooms(response.data, date, days, guests));
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      await ctx.reply('Произошла ошибка при получении свободных номеров. Пожалуйста, попробуйте позже.');
    }
  });
}

export default registerAvailabilityHandlers;
