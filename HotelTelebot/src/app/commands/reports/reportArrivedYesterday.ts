/* eslint-disable no-restricted-syntax,no-await-in-loop */
import bot from '~/app/bot';
import { parseDateFromLiterals } from '~/common/utils/dates';
import { BriefBookingActions, ColorfulBooking } from '~@components';
import { BookingsService } from '~@services';

const TEXT = 'Должны были заехать вчера и не отмечены как проживающие ⏰';

const reportArrivedYesterday = async (chatId: string) => {
  const date = parseDateFromLiterals('yesterday');
  const arrivals = await BookingsService.fetchBookingsArriveAtAndNotLiving(date);
  if (!arrivals.length) {
    return;
  }
  const titleMessage = await bot.telegram.sendMessage(chatId, TEXT);
  for (const booking of arrivals) {
    await bot.telegram.sendMessage(chatId, ColorfulBooking(booking), {
      reply_to_message_id: titleMessage.message_id,
      reply_markup: { inline_keyboard: BriefBookingActions(booking) },
      parse_mode: 'HTML'
    });
  }
};

export { reportArrivedYesterday };
