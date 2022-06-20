// every minute
import appConfig from '~/config/appConfig';
import { createSchedule } from '../../schedule.helper';
import { checkBookingUpdatesAndNotify } from './checkBookingUpdatesAndNotify';

appConfig.read().then(() => {
  createSchedule(appConfig.data.schedules.notifyOfBookingUpdates, checkBookingUpdatesAndNotify);
});
