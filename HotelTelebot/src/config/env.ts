import dotenv from 'dotenv';
import { getEnvArray } from '../common/utils/env';

dotenv.config();

function getEnv(key: string): string {
  const val = getOptionalEnv(key);
  if (!val) {
    throw new Error(`Env variable ${key} is not defined`);
  }
  return val;
}

function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

interface Env {
  nodeEnv: string;
  pmsAdapterUrl: string;
  xSecHeader: string;
  botToken: string;
  telegramIds: string[];
  notificationChannelId: string;
  waitNotificationMs: number;
}

const env: Env = {
  nodeEnv: getEnv('NODE_ENV'),
  pmsAdapterUrl: getEnv('PMS_ADAPTER_URL'),
  xSecHeader: getEnv('X_SEC_HEADER'),
  botToken: getEnv('BOT_TOKEN'),
  telegramIds: getEnvArray('TELEGRAM_IDS'),
  notificationChannelId: getEnv('NOTIFICATION_CHANNEL_ID'),
  waitNotificationMs: +getEnv('MS_TO_WAIT_AFTER_NOTIFICATION_SENDING')
};

export default env;
