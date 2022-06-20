import appConfig from '~/config/appConfig';
import { synchronizeData } from '~@commands/actions/synchronize/synchronizeData';
import { createSchedule } from '../../schedule.helper';

appConfig.read().then(() => {
  createSchedule(appConfig.data.schedules.synchronizeBookings, synchronizeData);
});
