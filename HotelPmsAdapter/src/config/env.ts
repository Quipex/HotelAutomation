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
  pmsId: string;
  pmsLogin: string;
  pmsPw: string;
  port: number;
  xSecHeader: string;
  chromePath: string;
  maxApiRetries: number;
  msToSleep_429: number;
}

const env: Env = {
  pmsId: getEnv('CREDS_ID'),
  pmsLogin: getEnv('CREDS_LOGIN'),
  pmsPw: getEnv('CREDS_PW'),
  port: Number(getOptionalEnv('PORT') ?? 3000),
  xSecHeader: getEnv('X_SEC_HEADER'),
  chromePath: getEnv('CHROME_PATH'),
  maxApiRetries: Number(getEnv('MAX_API_RETRIES')),
  msToSleep_429: Number(getEnv('TIME_TO_SLEEP'))
};

export default env;
