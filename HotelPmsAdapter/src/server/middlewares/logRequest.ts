import { AxiosError } from 'axios';
import { Context, Middleware, ParameterizedContext } from 'koa';
import { RESPONSE_TIME_HEADER, X_SEC_HEADER } from '~/common/constants';

import { sanitizeAxiosError } from '~/common/utils/web';
import { log } from '~/config/logger';

function logIncomingRequest(ctx: ParameterizedContext) {
  log.debug('Incoming Request', {
    url: ctx.url,
    path: ctx.path,
    method: ctx.method,
    headers: { ...ctx.headers, [X_SEC_HEADER]: 'hidden' },
    ip: ctx.ip
  });
}

function logOutcomingResponse(ctx: ParameterizedContext, ms: number) {
  log.debug('Outcoming Response', {
    ...(ctx.response.body && { body: ctx.response.body }),
    status: ctx.response.status,
    responseTime: `${ms}ms`
  });
}

const logRequestErrors = async (error: unknown, ctx: Context): Promise<void> => {
  if ((error as AxiosError).isAxiosError) {
    log.error('Axios Error', { error: sanitizeAxiosError(error), response: ctx.response });
    return;
  }
  log.error('General Error', { error, response: ctx.response });
};

const getPassedMillis = (start: number) => {
  return Date.now() - start;
};

const logRequest: Middleware = async (ctx, next): Promise<void> => {
  logIncomingRequest(ctx);
  const start = Date.now();
  try {
    await next();
  } catch (e) {
    const ms = getPassedMillis(start);
    ctx.set(RESPONSE_TIME_HEADER, `${ms}ms`);
    logRequestErrors(e, ctx);
    throw e;
  }
  const ms = getPassedMillis(start);
  ctx.set(RESPONSE_TIME_HEADER, `${ms}ms`);
  logOutcomingResponse(ctx, ms);
};

export default logRequest;
