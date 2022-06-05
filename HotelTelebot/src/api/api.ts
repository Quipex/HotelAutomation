import axios, { AxiosRequestConfig } from 'axios';
import env from '~/app/env';
import { RESPONSE_TIME } from '~/common/constants';
import { log } from '~/config/logger';

async function callApi(path: string, config: AxiosRequestConfig): Promise<unknown> {
  log.debug('Making request to backend', { path, config });
  const timeBeforeRequest = Date.now();
  const response = await axios(path, {
    ...config,
    baseURL: env.pmsAdapterUrl,
    headers: {
      x_security_header: env.xSecHeader
    }
  });
  const realMs = Date.now() - timeBeforeRequest;
  const backendResponseTime = response.headers[RESPONSE_TIME];
  log.debug(`Got response ${response.status} (${realMs}ms, server: ${backendResponseTime}ms)`, { data: response.data });
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
