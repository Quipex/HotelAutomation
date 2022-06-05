import { testsLog } from '~/config/logger';

beforeAll(() => {
  testsLog.info('Before tests');
});

afterAll(() => {
  testsLog.info('After tests');
});
