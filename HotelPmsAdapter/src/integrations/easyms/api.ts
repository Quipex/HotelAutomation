import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { sleep } from '~/common/utils/thread';
import env from '~/config/env';
import { log } from '~/config/logger';
import { authenticateAndGetToken } from './auth';

type CallPmsApiConfig = {
  requestConfig: AxiosRequestConfig;
  forceLogin: boolean;
  currentTry?: number;
};
const MAX_RETRIES = env.maxApiRetries;
const TIME_TO_SLEEP = env.msToSleep_429;

const applyAuthToHeaders = (token: string, headers: any) => {
  return { ...headers, Authorization: `Bearer ${token}` };
};

const handleAxiosError = async (err: AxiosError, path: string, {
  requestConfig,
  forceLogin,
  currentTry
}: CallPmsApiConfig): Promise<AxiosPromise<unknown>> => {
  if (err.response) {
    const { status, data, headers } = err.response;
    if (status === 429) {
      log.warn(`[from:easyms] Making requests too fast. Sleeping for ${TIME_TO_SLEEP}ms`);
      await sleep(TIME_TO_SLEEP);
    } else if (status >= 500) {
      log.warn(`[from:easyms] The remote server failed, got response ${status}`, { status, data, headers });
    } else if (status === 401) {
      log.warn('[from:easyms] Got 401, need to log in again');
      forceLogin = true;
    } else {
      return Promise.reject(err);
    }
  }
  const nextRetryAttempt = currentTry + 1;
  if (nextRetryAttempt > MAX_RETRIES) {
    return Promise.reject(new Error('Max retries exceeded'));
  }
  log.info(`[to:easyms] Retrying ${nextRetryAttempt} time...`);
  return callPmsApi(path, { requestConfig, currentTry: nextRetryAttempt, forceLogin });
};

const callPmsApi = async (path: string, {
  requestConfig, forceLogin, currentTry = 1
}: CallPmsApiConfig): Promise<AxiosPromise<unknown>> => {
  const token = await authenticateAndGetToken(forceLogin);
  const headers = applyAuthToHeaders(token, requestConfig.headers);
  try {
    log.debug('[to:easyms]', { path, requestConfig });
    const axiosResponse = await axios(path, {
      ...requestConfig,
      headers,
      baseURL: env.easyMsBaseUrl
    });
    log.debug('[from:easyms]', { data: axiosResponse.data, status: axiosResponse.status });
    return axiosResponse;
  } catch (e: unknown) {
    if ((e as AxiosError).isAxiosError) {
      return handleAxiosError(e as AxiosError, path, { currentTry, requestConfig, forceLogin });
    }
    log.error('[from:easyms] Unexpected error', e);
    throw e;
  }
};

export default {
  get: async (path: string, config: AxiosRequestConfig) => callPmsApi(path, {
    requestConfig: {
      ...config,
      method: 'GET'
    },
    forceLogin: false
  }),
  post: async (path: string, config: AxiosRequestConfig) => callPmsApi(path, {
    requestConfig: {
      ...config,
      method: 'POST'
    },
    forceLogin: false
  })
};
