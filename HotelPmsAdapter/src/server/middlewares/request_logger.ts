import { Middleware } from 'koa';
import { log } from '~/config/logger';

const logRequest: Middleware = async (ctx, next): Promise<void> => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  log.info('Request', {
    url: ctx.url,
    path: ctx.path,
    method: ctx.method,
    headers: { ...ctx.headers, x_security_header: 'hidden' },
    ip: ctx.ip,
    responseTime: rt
  });
};

export default logRequest;
