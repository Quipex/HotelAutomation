import putSyncBookings from '../../../api/services/putSyncBookings';
import putSyncClients from '../../../api/services/putSyncClients';
import { createSchedule } from '../schedule.helper';

// every 10 minutes
createSchedule('0 0/10 * * * *', synchronizeBookingsAndClients);

async function synchronizeBookingsAndClients() {
  await putSyncBookings();
  await putSyncClients();
}
