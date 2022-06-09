import { BookingsService } from '~/api/services';
import { createSchedule } from '../schedule.helper';

// every 10 minutes
createSchedule('0 0/10 * * * *', synchronizeBookings);

async function synchronizeBookings() {
  await BookingsService.syncBookings();
}
