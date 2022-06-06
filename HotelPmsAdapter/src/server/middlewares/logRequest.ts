import { AxiosError } from 'axios';
import { Context, Middleware, ParameterizedContext } from 'koa';
import { REQUEST_ID_HEADER, RESPONSE_TIME_HEADER, X_SEC_HEADER } from '~/common/constants';
import { uuidv4 } from '~/common/utils/uuid';
import { sanitizeAxiosError } from '~/common/utils/web';
import { log } from '~/config/logger';

function logIncomingRequest(requestId, ctx: ParameterizedContext) {
  log.debug(`[${requestId}] Incoming Request`, {
    url: ctx.url,
    path: ctx.path,
    method: ctx.method,
    headers: { ...ctx.headers, [X_SEC_HEADER]: 'hidden' },
    ip: ctx.ip
  });
}

function logOutcomingResponse(requestId, ctx: ParameterizedContext, ms: number) {
  log.debug(`[${requestId}] Outcoming Response`, {
    ...(ctx.response.body && { body: ctx.response.body }),
    status: ctx.response.status,
    responseTime: `${ms}ms`
  });
}

const logRequestErrors = async (error: unknown, ctx: Context): Promise<void> => {
  const requestId = ctx.response.headers[REQUEST_ID_HEADER];
  const prefix = requestId ?? 'No request id';
  if ((error as AxiosError).isAxiosError) {
    log.error(`[${prefix}] Axios Error`, { error: sanitizeAxiosError(error), response: ctx.response });
  }
  log.error(`[${prefix}] General Error`, { error, response: ctx.response });
};

const getPassedMillis = (start: number) => {
  return Date.now() - start;
};

const logRequest: Middleware = async (ctx, next): Promise<void> => {
  const requestId = uuidv4();
  ctx.set(REQUEST_ID_HEADER, requestId);
  logIncomingRequest(requestId, ctx);
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
  logOutcomingResponse(requestId, ctx, ms);
};

export default logRequest;
