import { Telegraf } from 'telegraf';
import { api } from '../api';
import { formatAvailableRooms } from '../formatter';

// Define the DTO interface
interface RoomAvailabilityDto {
  roomId: string;
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
      const date = args[1];
      const days = parseInt(args[2], 10);
      const guests = parseInt(args[3], 10);

      // Validate arguments
      if (Number.isNaN(days) || days <= 0) {
        return await ctx.reply('Количество дней должно быть положительным числом.');
      }

      if (Number.isNaN(guests) || guests <= 0) {
        return await ctx.reply('Количество гостей должно быть положительным числом.');
      }

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return await ctx.reply('Дата должна быть в формате YYYY-MM-DD, например: 2023-12-25');
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
  
  // Handler for '/available_native <date> <days> <guests>' command using the native SQL DTO projection
  bot.command('available_native', async (ctx) => {
    try {
      const [, fromDate, numDays, guests] = ctx.message.text.split(" ");
      
      // Validate arguments
      if (!fromDate || !numDays || !guests) {
        return await ctx.reply(
          'Пожалуйста, укажите дату, количество дней и количество гостей. '
          + 'Пример: /available_native 2023-12-25 3 2'
        );
      }
      
      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
        return await ctx.reply('Дата должна быть в формате YYYY-MM-DD, например: 2023-12-25');
      }
      
      // Validate numDays and guests
      const daysValue = parseInt(numDays, 10);
      const guestsValue = parseInt(guests, 10);
      
      if (isNaN(daysValue) || daysValue <= 0 || daysValue > 365) {
        return await ctx.reply('Количество дней должно быть положительным числом не больше 365.');
      }
      
      if (isNaN(guestsValue) || guestsValue <= 0 || guestsValue > 10) {
        return await ctx.reply('Количество гостей должно быть положительным числом не больше 10.');
      }
      
      // Get available rooms from backend using the DTO projection endpoint
      const res = await api.getAvailableRoomsDto(fromDate, daysValue, guestsValue);
      const list = res.data as RoomAvailabilityDto[];
      
      if (list.length === 0) {
        return ctx.reply("Свободных номеров не найдено");
      }
      
      const text = list
        .map(r => `№${r.number} (${r.capacity} чел., этаж ${r.floor}, вид ${r.hasSeaView ? "есть" : "нет"})`)
        .join("\n");
      
      ctx.reply(text);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      await ctx.reply('Ошибка при запросе доступных номеров');
    }
  });
}

export default registerAvailabilityHandlers;
