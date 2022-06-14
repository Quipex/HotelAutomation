import { schedule, ScheduleOptions } from 'node-cron';
import bot from '~/app/bot';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';
import { sanitizeAxiosError } from '~/common/utils/web';
import env from '~/config/env';
import { backgroundLog } from '~/config/logger';

const time = () => formatDate(new Date(), DATETIME_DAYOFWEEK_MOMENTJS);

export function createSchedule(cronExpression: string, func: () => void, options?: ScheduleOptions) {
  schedule(cronExpression, () => {
    backgroundLog.debug(`Running schedule '${func.name}' at ${time()}`);
    try {
      func();
    } catch (e) {
      const msg = `☠ Got an error while running schedule '${func.name}' at ${time()}`;
      backgroundLog.error(msg, e.isAxiosError ? sanitizeAxiosError(e) : e);
      bot.telegram.sendMessage(env.notificationChannelId, msg).catch((reason) => {
        backgroundLog.error('Failed to send the error', { reason });
      });
    } finally {
      backgroundLog.debug(`Schedule '${func.name}' finished at ${time()}`);
    }
  }, { timezone: 'Europe/Kiev', ...options });
  backgroundLog.debug(`Registered schedule '${func.name}' running at '${cronExpression}'`);
}
