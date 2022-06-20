import { schedule, ScheduleOptions } from 'node-cron';
import bot from '~/app/bot';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';
import { sanitizeAxiosError } from '~/common/utils/web';
import env from '~/config/env';
import { backgroundLog } from '~/config/logger';

const time = () => formatDate(new Date(), DATETIME_DAYOFWEEK_MOMENTJS);

export function createSchedule(cronExpressions: string[], func: () => Promise<void>, options?: ScheduleOptions) {
  cronExpressions.forEach((cronExpression) => {
    schedule(cronExpression, async () => {
      backgroundLog.debug(`Running schedule '${func.name}' at ${time()}`);
      try {
        await func();
      } catch (e) {
        backgroundLog.error(
          `Got an error while running schedule '${func.name}`,
          e.isAxiosError ? sanitizeAxiosError(e) : e
        );
        const msg = `☠  Got an error while running schedule '${func.name}'\n`
          + `At ${time()}\n\n`
          + `Error: ${e.message}`;
        bot.telegram.sendMessage(env.notificationChannelId, msg, { disable_notification: true }).catch((reason) => {
          backgroundLog.error('Failed to send the error', { reason });
        });
      } finally {
        backgroundLog.debug(`Schedule '${func.name}' finished at ${time()}`);
      }
    }, { timezone: 'Europe/Kiev', ...options });
    backgroundLog.debug(`Registered schedule '${func.name}' running at '${cronExpression}'`);
  });
}
