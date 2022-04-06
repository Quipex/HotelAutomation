import { getOptionalEnv } from './getOptionalEnv';

const getEnv = (key: string): string => {
  const val = getOptionalEnv(key);
  if (!val) {
    throw new Error(`Env variable ${key} is not defined`);
  }
  return val;
}

export { getEnv };
