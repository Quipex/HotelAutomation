import axios, { AxiosRequestConfig } from 'axios';
import { IWebDriverCookie } from 'selenium-webdriver';
import { stringifyUrl } from '~/common/utils/url';
import { sleep } from '~/common/utils/thread';
import { log } from '~/config/logger';
import { authAndGetCookies } from './auth';
import env from '~/config/env';

let cookies: IWebDriverCookie[] = [];
const MAX_RETRIES = env.maxApiRetries;
const TIME_TO_SLEEP = env.msToSleep_429;

interface PmsPage {
  offset: number;
  pageNumber: number;
  pageSize: number;
  sort: Record<string, unknown>;
  totalCount: number;
}

export interface PmsApiResponse<T> {
  content: T[] | any;
  page: PmsPage;
  success: boolean;
}

function pmsUrl(path: string) {
  const restUrl = path.startsWith('/') ? path : (`/${path}`);
  return `https://pmscloud.com/app/rest${restUrl}`;
}

interface RequestConfig extends AxiosRequestConfig {
  extra?: {
    page?: number;
    limit?: number;
  };
}

type CallPmsApiOptions = {
  config?: RequestConfig,
  retry?: number,
  accumulatedData?: unknown[]
};

async function callPmsApi(
  path: string,
  { config = {}, retry = 0, accumulatedData = [] }: CallPmsApiOptions
): Promise<unknown> {
  if (cookies.length === 0) {
    log.debug('[api] no cookies, getting some...');
    cookies = await authAndGetCookies();
  }
  log.debug('[api] current cookies', cookies);

  if (config.extra) {
    const [pathname, queryParams = {}] = path.split('?');
    if (!queryParams) {
      path = stringifyUrl({ url: pathname, query: { ...queryParams, ...config.extra } });
    }
  }

  try {
    const url = pmsUrl(path);
    log.debug('[api] making request...', url, config);
    const response = await axios(url, {
      ...config,
      headers: {
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua-mobile': '?0',
        // eslint-disable-next-line max-len
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
        Accept: '*/*',
        Cookie: cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(',')
      }
    });
    log.debug('[api] received response.');
    const responseData = response.data as PmsApiResponse<unknown>;
    if (!responseData) {
      return {};
    }
    log.debug('[api] handling response data.');
    if (responseData.page === undefined) {
      return responseData;
    }
    if (anyContentLeft(responseData.page)) {
      return await callPmsApi(path, {
        config: withNextPage(config),
        accumulatedData: [...accumulatedData, ...responseData.content]
      });
    }
    if (responseData.content instanceof Array) {
      return [...accumulatedData, ...responseData.content];
    }
    return responseData.content;
  } catch (error) {
    if (error.response) {
      const { status, data, headers } = error.response;
      if (status === 429) {
        log.warn(`[api] making requests too fast. Sleeping for ${TIME_TO_SLEEP}ms`);
        await sleep(TIME_TO_SLEEP);
      } else if (status >= 500) {
        log.warn(`[api] got response ${status}`, { status, data, headers });
      } else if (status === 401) {
        log.warn('[api] got 401, need to log in again');
      } else {
        log.warn('[api] got response with bad status', { status, data, headers });
        return Promise.reject(`Bad response status ${status}`);
      }
    }
    if (retry > MAX_RETRIES) {
      return Promise.reject(new Error('Max retries exceeded'));
    }
    const nextRetryAttempt = retry + 1;
    log.info(`[api] retrying ${nextRetryAttempt} time...`);
    cookies = await authAndGetCookies();
    return callPmsApi(path, { config, retry: nextRetryAttempt, accumulatedData });
  }
}

function anyContentLeft(page: PmsPage) {
  const { totalCount, pageNumber, pageSize } = page;
  // pageNumber at the response is zero-based
  return pageSize * (pageNumber + 1) < totalCount;
}

function withNextPage(config: RequestConfig): RequestConfig {
  // page at url query is one-based
  const prevPage = config.extra?.page ?? 1;
  return {
    ...config,
    extra: {
      ...config.extra,
      page: prevPage + 1
    }
  };
}

export default {
  /**
   * Make a call and retry if it failed up to 3 times
   */
  get: async function get(path: string, config?: RequestConfig): Promise<unknown> {
    return callPmsApi(path, { config: { method: 'GET', ...config } });
  },
  /**
   * Make a call and retry if it failed up to 3 times
   */
  post: async function post(path: string, config?: RequestConfig): Promise<unknown> {
    return callPmsApi(path, { config: { method: 'POST', ...config } });
  }
};
