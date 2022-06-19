import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { REQUEST_ID_HEADER, RESPONSE_TIME_HEADER, X_SEC_HEADER } from '~/common/constants';
import { uuidv4 } from '~/common/utils/uuid';
import env from '~/config/env';
import { log } from '~/config/logger';

async function callApi(path: string, config: AxiosRequestConfig): Promise<unknown> {
  const uuid = uuidv4();
  log.debug(`[-->] Request (${uuid})`, { path, config });
  const timeBeforeRequest = Date.now();
  const response = await axios(path, {
    ...config,
    baseURL: env.pmsAdapterUrl,
    headers: {
      [X_SEC_HEADER]: env.xSecHeader
    },
    validateStatus: () => true
  });
  const realMs = Date.now() - timeBeforeRequest;
  const backendResponseTime = response.headers[RESPONSE_TIME_HEADER];
  log.debug(`[<--] Response (${uuid}) '${response.status}' `
    + `(${realMs}ms, server: ${backendResponseTime}, id: ${response.headers[REQUEST_ID_HEADER]})`, {
    data: response.data
  });
  if (response.status >= 300) {
    throw new AxiosError(response.statusText, response.status.toString(), response.config, response.request, response);
  }
  return response.data;
}

const api = {
  call: async function call(path: string, config?: AxiosRequestConfig): Promise<unknown> {
    return callApi(path, config);
  },
  get: async function get(path: string, config?: AxiosRequestConfig): Promise<unknown> {
    return callApi(path, { method: 'GET', ...config });
  },
  post: async function post(path: string, config?: AxiosRequestConfig): Promise<unknown> {
    return callApi(path, { method: 'POST', ...config });
  },
  put: async function put(path: string, config?: AxiosRequestConfig): Promise<unknown> {
    return callApi(path, { method: 'PUT', ...config });
  }
};

export default api;
