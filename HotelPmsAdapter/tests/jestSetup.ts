import appDataSource from '~/config/dataSource';
import { testsLog } from '~/config/logger';

beforeAll(async () => {
  testsLog.info('Before tests');
  try {
    await appDataSource.initialize();
  } catch (e) {
    process.exit(1);
  }
});

afterAll(async () => {
  testsLog.info('After tests');
  try {
    await appDataSource.undoLastMigration({ transaction: 'all' });
    await appDataSource.destroy();
  } catch (e) {
    process.exit(1);
  }
});
