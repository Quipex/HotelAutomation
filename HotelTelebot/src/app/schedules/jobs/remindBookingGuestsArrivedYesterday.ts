import env from '~/config/env';
import reportArrivedYesterday from '~/app/commands/reports/reportArrivedYesterday';
import { createSchedule } from '../schedule.helper';

const remindBookingGuestsArrivedYesterday = async () => {
  env.telegramIds.forEach(async (chatId) => {
    await reportArrivedYesterday(chatId);
  });
};

// at 8:00
createSchedule('0 0 8 * * *', remindBookingGuestsArrivedYesterday);
// at 20:00
createSchedule('0 0 20 * * *', remindBookingGuestsArrivedYesterday);
