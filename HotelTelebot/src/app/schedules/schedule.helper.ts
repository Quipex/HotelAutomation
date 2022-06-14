import { schedule, ScheduleOptions } from 'node-cron';
import bot from '~/app/bot';
import env from '~/config/env';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';
import { sanitizeAxiosError } from '~/common/utils/web';
import { log } from '~/config/logger';

const time = () => formatDate(new Date(), DATETIME_DAYOFWEEK_MOMENTJS);

export function createSchedule(cronExpression: string, func: () => void, options?: ScheduleOptions) {
  schedule(cronExpression, () => {
    log.debug(`Running schedule '${func.name}' at ${time()}`);
    try {
      func();
    } catch (e) {
      const msg = `☠ Got an error while running schedule '${func.name}' at ${time()}`;
      log.error(msg, e.isAxiosError ? sanitizeAxiosError(e) : e);
      bot.telegram.sendMessage(env.notificationChannelId, msg).catch((reason) => {
        log.error('Failed to send the error', { reason });
      });
    } finally {
      log.debug(`Schedule '${func.name}' finished at ${time()}`);
    }
  }, { timezone: 'Europe/Kiev', ...options });
  log.debug(`Registered schedule '${func.name}' running at '${cronExpression}'`);
}
