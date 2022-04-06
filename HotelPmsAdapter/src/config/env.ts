import dotenv from 'dotenv';
import { getEnv, getOptionalEnv } from '~/config/helpers/env';
import { resolveBoolean } from '~/config/helpers/env/resolveBoolean';

dotenv.config();

interface Env {
  pmsCloudId: string;
  pmsCloudLogin: string;
  pmsCloudPw: string;
  easyMsLogin: string;
  easyMsPw: string;
  easyMsBaseUrl: string;
  port: number;
  xSecHeader: string;
  chromePath: string;
  maxApiRetries: number;
  msToSleep_429: number;
  db: {
    type: string;
    host: string;
    username: string;
    password: string;
    database: string;
    port: number;
  },
  typeorm: {
    synchronize: boolean;
    logging: boolean;
    migrationsRun: boolean;
  }
}

const pmsProvider = getEnv('PMS_PROVIDER');
const isPmsCloud = pmsProvider === 'PMS_CLOUD';
const isEasyMs = pmsProvider === 'EASY_MS';

const env: Env = {
  pmsCloudId: isPmsCloud ? getEnv('PMS_CLOUD_ID') : getOptionalEnv('PMS_CLOUD_ID'),
  pmsCloudLogin: isPmsCloud ? getEnv('PMS_CLOUD_LOGIN') : getOptionalEnv('PMS_CLOUD_LOGIN'),
  pmsCloudPw: isPmsCloud ? getEnv('PMS_CLOUD_PW') : getOptionalEnv('PMS_CLOUD_PW'),
  easyMsLogin: isEasyMs ? getEnv('EASY_MS_LOGIN') : getOptionalEnv('EASY_MS_LOGIN'),
  easyMsPw: isEasyMs ? getEnv('EASY_MS_PW') : getOptionalEnv('EASY_MS_PW'),
  easyMsBaseUrl: isEasyMs ? getEnv('EASY_MS_BASE_URL') : getOptionalEnv('EASY_MS_BASE_URL'),
  port: Number(getOptionalEnv('APP_PORT') ?? 3000),
  xSecHeader: getEnv('X_SEC_HEADER'),
  chromePath: getOptionalEnv('CHROME_PATH'),
  maxApiRetries: Number(getEnv('MAX_API_RETRIES')),
  msToSleep_429: Number(getEnv('TIME_TO_SLEEP')),
  db: {
    type: getEnv('DB_TYPE'),
    database: getEnv('DB_DATABASE'),
    host: getEnv('DB_HOST'),
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    port: Number(getEnv('DB_PORT'))
  },
  typeorm: {
    logging: resolveBoolean(getEnv('TYPEORM_LOGGING')),
    migrationsRun: resolveBoolean(getEnv('TYPEORM_MIGRATIONS_RUN')),
    synchronize: resolveBoolean(getEnv('TYPEORM_SYNCHRONIZE'))
  }
};

export default env;
