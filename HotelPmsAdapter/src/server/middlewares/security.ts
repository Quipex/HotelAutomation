import { Middleware } from 'koa';
import { log } from '~/config/logger';
import env from '~/config/env';

const checkHeaderValidAndReject: Middleware = async (ctx, next): Promise<void> => {
  const { request: req } = ctx;
  const secHeader = req.headers.x_security_header;
  if (secHeader !== env.xSecHeader) {
    log.debug('Blocked request', {
      time: new Date().toLocaleString(),
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
    ctx.status = 403;
    ctx.body = ':(';
  } else {
    await next();
  }
};

export default checkHeaderValidAndReject;
