import { BookingsService } from '~/api/services';
import { createSchedule } from '../schedule.helper';

const synchronizeBookings = async () => {
  await BookingsService.syncBookings();
};

// every 10 minutes
createSchedule('0 0/10 * * * *', synchronizeBookings);
