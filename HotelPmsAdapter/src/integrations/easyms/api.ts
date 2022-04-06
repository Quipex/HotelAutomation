import { AxiosError, AxiosRequestConfig } from 'axios';
import env from '~/config/env';
import { authenticateAndGetToken } from '~/integrations/easyms/auth';
import { fetch } from '~/common/utils/web';
import { sleep } from '~/common/utils/thread';
import { log } from '~/config/logger';

type CallPmsApiConfig = {
  requestConfig: AxiosRequestConfig;
  currentTry?: number;
};
const MAX_RETRIES = env.maxApiRetries;
const TIME_TO_SLEEP = env.msToSleep_429;
const EASY_MS_BASE_URL = env.easyMsBaseUrl;

const applyAuthToHeaders = (token: string, headers: any) => {
  return { ...headers, authentication: `Bearer ${token}` };
};

const callPmsApi = async <T = any>(path: string, { requestConfig, currentTry = 1 }: CallPmsApiConfig): Promise<T> => {
  const token = await authenticateAndGetToken();
  const headers = applyAuthToHeaders(token, requestConfig.headers);
  const baseURL = EASY_MS_BASE_URL;
  try {
    return fetch(path, { ...requestConfig, headers, baseURL });
  } catch (e: unknown) {
    if ((e as AxiosError).isAxiosError) {
      return handleAxiosError(e as AxiosError, path, { currentTry, requestConfig });
    }
    log.error('Unexpected error at api call', e);
  }
};

const handleAxiosError = async <T = any>(err: AxiosError, path: string, {
  requestConfig,
  currentTry
}: CallPmsApiConfig): Promise<T> => {
  if (err.response) {
    const { status, data, headers } = err.response;
    if (status === 429) {
      log.warn(`Making requests too fast. Sleeping for ${TIME_TO_SLEEP}ms`);
      await sleep(TIME_TO_SLEEP);
    } else if (status >= 500) {
      log.warn(`Got response ${status}`, { status, data, headers });
    } else if (status === 401) {
      log.warn('Got 401, need to log in again');
    } else {
      log.warn(`Got response with unexpected status code ${status}`, { status, data, headers });
      return Promise.reject(`Bad response status ${status}`);
    }
  }
  if (currentTry > MAX_RETRIES) {
    return Promise.reject(new Error('Max retries exceeded'));
  }
  const nextRetryAttempt = currentTry + 1;
  log.info(`Retrying ${nextRetryAttempt} time...`);
  return callPmsApi(path, { requestConfig, currentTry: nextRetryAttempt });
};

export default {
  get: async (path: string, config: CallPmsApiConfig) => callPmsApi(path, {
    ...config,
    requestConfig: {
      ...config.requestConfig,
      method: 'GET'
    }
  }),
  post: async (path: string, config: CallPmsApiConfig) => callPmsApi(path, {
    ...config,
    requestConfig: {
      ...config.requestConfig,
      method: 'POST'
    }
  })
};
