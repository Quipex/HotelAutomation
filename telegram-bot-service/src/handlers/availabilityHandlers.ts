import { Telegraf } from 'telegraf';
import { api } from '../api';

// Define the interface for room data
interface RoomDto {
  id: string;
  number: string;
  type: string;
  capacity: number;
  floor: number;
  hasSeaView: boolean;
}

/**
 * Register availability related handlers
 */
export function registerAvailabilityHandlers(bot: Telegraf) {
  // Handler for '/available <date> <days> <guests>' command
  bot.command('available', async (ctx) => {
    try {
      const args = ctx.message.text.split(' ');
      if (args.length < 4) {
        return await ctx.reply(
          'Пожалуйста, укажите дату, количество дней и количество гостей. '
          + 'Пример: /available 2023-12-25 3 2'
        );
      }

      // Parse arguments
      const fromDate = args[1];
      const numDays = parseInt(args[2], 10);
      const guests = parseInt(args[3], 10);

      // Validate arguments
      if (Number.isNaN(numDays) || numDays <= 0 || numDays > 365) {
        return await ctx.reply('Количество дней должно быть положительным числом не больше 365.');
      }

      if (Number.isNaN(guests) || guests <= 0 || guests > 10) {
        return await ctx.reply('Количество гостей должно быть положительным числом не больше 10.');
      }

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
        return await ctx.reply('Дата должна быть в формате YYYY-MM-DD, например: 2023-12-25');
      }

      // Get available rooms from backend
      const response = await api.getAvailableRooms(fromDate, numDays, guests);
      const rooms = response.data as RoomDto[];

      // If no rooms found, return appropriate message
      if (rooms.length === 0) {
        return await ctx.reply(`На дату ${fromDate} на ${numDays} дней для ${guests} гостей свободных номеров не найдено.`);
      }

      // Format rooms into text list
      const roomsList = rooms
        .map((r) => `№${r.number} (${r.capacity} чел., этаж ${r.floor}, вид ${r.hasSeaView ? 'есть' : 'нет'})`)
        .join('\n');

      await ctx.reply(roomsList);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      await ctx.reply('Произошла ошибка при получении свободных номеров. Пожалуйста, попробуйте позже.');
    }
  });
}

export default registerAvailabilityHandlers;
