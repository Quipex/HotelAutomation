import appDataSource from '~/config/dataSource';
import { testsLog } from '~/config/logger';

beforeAll(async () => {
  testsLog.info('Before tests');
  await appDataSource.initialize();
});

afterAll(async () => {
  testsLog.info('After tests');
  await appDataSource.undoLastMigration({ transaction: 'all' });
  await appDataSource.destroy();
});
