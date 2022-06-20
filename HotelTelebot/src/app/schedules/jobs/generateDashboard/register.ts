import { createSchedule } from '~/app/schedules/schedule.helper';
import appConfig from '~/config/appConfig';
import { generateAndSendDashboard } from './generateAndSendDashboard';

appConfig.read().then(() => {
  createSchedule(appConfig.data.schedules.generateDashboard, generateAndSendDashboard);
});
