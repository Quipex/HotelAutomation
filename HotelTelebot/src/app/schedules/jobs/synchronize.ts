import { BookingsService, ClientsService } from '~/api/services';
import { createSchedule } from '../schedule.helper';

// every 10 minutes
createSchedule('0 0/10 * * * *', synchronizeBookingsAndClients);

async function synchronizeBookingsAndClients() {
  await BookingsService.syncBookings();
  await ClientsService.syncClients();
}
