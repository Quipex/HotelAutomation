import dotenv from 'dotenv';

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
  chromePath: getEnv('CHROME_PATH'),
  maxApiRetries: Number(getEnv('MAX_API_RETRIES')),
  msToSleep_429: Number(getEnv('TIME_TO_SLEEP'))
};

export default env;
