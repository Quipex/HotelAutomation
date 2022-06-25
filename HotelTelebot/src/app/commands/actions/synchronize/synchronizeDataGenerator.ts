import { SynchronizationStatusArgs } from '~/app/message_components/SynchronizationStatus';
import { BookingService } from '~@services';

const MAX_STAGES = 2;

const getStatus = (args: Omit<SynchronizationStatusArgs, 'maxStages'>) => ({ ...args, maxStages: MAX_STAGES });

function* synchronizeDataGenerator() {
  yield getStatus({ stageText: 'бронирования', currentStage: 1 });
  yield BookingService.syncBookings();
  yield getStatus({ stageText: 'всё синхронизировано', currentStage: 2, done: true });
}

export { synchronizeDataGenerator };
