import moment from 'moment';
import { schedule, ScheduleOptions } from 'node-cron';
import { log } from '~/config/logger';

const time = () => moment().format('llll');

export function createSchedule(cronExpression: string, func: () => void, options?: ScheduleOptions) {
  schedule(cronExpression, () => {
    log.info(`Running schedule '${func.name}' at ${time()}`);
    try {
      func();
    } catch (e) {
      log.error(`Got an error while running schedule '${func.name}' at ${time()}`, e);
    } finally {
      log.info(`Schedule '${func.name}' finished at ${time()}`);
    }
  }, { timezone: 'Europe/Kiev', ...options });
}
