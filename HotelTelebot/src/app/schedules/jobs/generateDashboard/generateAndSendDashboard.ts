import bot from '~/app/bot';
import DashboardActions from '~/app/message_components/dashboard/DashboardActions';
import { formatDate } from '~/common/utils/dates';
import env from '~/config/env';
import { Dashboard } from '~@components';
import { DashboardService } from '~@services';

const generateAndSendDashboard = async () => {
  const today = new Date();
  const status = await DashboardService.getDailyStatus(formatDate(today));
  env.telegramIds.forEach(async (telegramId) => {
    await bot.telegram.sendMessage(telegramId, Dashboard(status, today), {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: DashboardActions(today) }
    });
  });
};

export { generateAndSendDashboard };
