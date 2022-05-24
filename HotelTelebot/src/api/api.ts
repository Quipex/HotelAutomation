import axios, { AxiosRequestConfig } from 'axios';
import env from '~/app/env';
import { log } from '~/config/logger';

function apiUrl(path: string): string {
  const restUrl = path.startsWith('/') ? path : (`/${path}`);
  return env.pmsAdapterUrl + restUrl;
}

async function callApi(path: string, config: AxiosRequestConfig): Promise<unknown> {
  log.debug('making request', { path, config });
  return {};
  return (await axios(apiUrl(path), {
    ...config,
    headers: {
      x_security_header: env.xSecHeader
    }
  })).data;
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
