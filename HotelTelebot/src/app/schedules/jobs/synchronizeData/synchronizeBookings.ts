import { BookingsService } from '~/api/services';

const synchronizeBookings = async () => {
  await BookingsService.syncBookings();
};

export { synchronizeBookings };
