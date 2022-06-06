import { Middleware } from 'koa';
import { log } from '~/config/logger';

const logRequest: Middleware = async (ctx, next): Promise<void> => {
  log.debug('Request', {
    url: ctx.url,
    path: ctx.path,
    method: ctx.method,
    headers: { ...ctx.headers, x_security_header: 'hidden' },
    ip: ctx.ip
  });
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  log.debug('Response', {
    ...(ctx.response.body && { body: ctx.response.body }),
    status: ctx.response.status,
    responseTime: `${ms}ms`
  });
};

export default logRequest;
