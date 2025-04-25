import { Context, Telegraf } from 'telegraf';
import { api } from '../api';
import { formatBooking } from '../formatter';

/**
 * Register booking related handlers
 */
export function registerBookingHandlers(bot: Telegraf<Context>) {
  // Handler for '/booking <id>' command
  bot.command('booking', async (ctx) => {
    try {
      const args = ctx.message.text.split(' ');
      if (args.length < 2) {
        return ctx.reply('Пожалуйста, укажите ID бронирования. Пример: /booking 123');
      }

      const bookingId = args[1];
      const response = await api.getBooking(bookingId);

      ctx.replyWithMarkdown(formatBooking(response.data));
    } catch (error: any) {
      console.error('Error fetching booking:', error);

      if (error.response?.status === 404) {
        return ctx.reply(`Бронирование с ID ${ctx.message.text.split(' ')[1]} не найдено.`);
      }

      ctx.reply('Произошла ошибка при получении данных бронирования. Пожалуйста, попробуйте позже.');
    }
  });

  // Add more booking related commands here
  // For example, searching bookings by date, etc.
}

export default registerBookingHandlers;
