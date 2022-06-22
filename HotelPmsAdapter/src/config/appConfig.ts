import { Low } from 'lowdb';
import { YAMLFileAdapter } from '~/common/plugins';

type AppConfig = {
  clientPrepaymentHours: number
};

const appConfigPath = 'config/app.yml';
const adapter = new YAMLFileAdapter<AppConfig>(appConfigPath);
const appConfig = new Low(adapter);

export { appConfigPath };

export default appConfig;
