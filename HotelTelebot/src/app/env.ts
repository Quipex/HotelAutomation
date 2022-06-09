import dotenv from 'dotenv';
import { getEnvArray } from '~/common/utils/env';

dotenv.config();

export function getEnv(key: string): string {
  const val = getOptionalEnv(key);
  if (!val) {
    throw new Error(`Env variable ${key} is not defined`);
  }
  return val;
}

export function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

interface Env {
  nodeEnv: string;
  pmsAdapterUrl: string;
  xSecHeader: string;
  botToken: string;
  telegramIds: string[];
}

const env: Env = {
  nodeEnv: getEnv('NODE_ENV'),
  pmsAdapterUrl: getEnv('PMS_ADAPTER_URL'),
  xSecHeader: getEnv('X_SEC_HEADER'),
  botToken: getEnv('BOT_TOKEN'),
  telegramIds: getEnvArray('TELEGRAM_IDS')
};

export default env;
