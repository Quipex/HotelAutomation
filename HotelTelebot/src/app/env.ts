import dotenv from 'dotenv';
import { getOsEnvArray } from '../utils/path.helper';

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
  pmsAdapterUrl: string;
  xSecHeader: string;
  botToken: string;
  telegramIds: string[];
}

const env: Env = {
  pmsAdapterUrl: getEnv('PMS_ADAPTER_URL'),
  xSecHeader: getEnv('X_SEC_HEADER'),
  botToken: getEnv('BOT_TOKEN'),
  telegramIds: getOsEnvArray('TELEGRAM_IDS')
};

export default env;
