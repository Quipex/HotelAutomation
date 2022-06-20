import appConfig from '~/config/appConfig';
import { createSchedule } from '../../schedule.helper';
import { synchronizeBookings } from './synchronizeBookings';

appConfig.read().then(() => {
  createSchedule(appConfig.data.schedules.synchronizeBookings, synchronizeBookings);
});
