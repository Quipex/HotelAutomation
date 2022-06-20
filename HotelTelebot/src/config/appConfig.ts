import { Low } from 'lowdb';
import { YAMLFileAdapter } from '~/common/plugins';
import { log } from './logger';

type AppConfig = {
  waitNotificationMs: number;
  schedules: {
    notifyOfBookingUpdates: string[],
    synchronizeBookings: string[],
    generateDashboard: string[]
  }
};

const configPath = 'config/app.yaml';
const adapter = new YAMLFileAdapter<AppConfig>(configPath);
const appConfig = new Low(adapter);

appConfig.read()
  .then(() => {
    log.info(`✅  Read the contents of app config '${configPath}'`);
  })
  .catch((e) => {
    log.error(`☠  Failed to read the contents of app config '${configPath}'`, e);
    process.exit(1);
  });

export default appConfig;
