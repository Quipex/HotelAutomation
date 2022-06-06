import { Middleware } from 'koa';
import { X_SEC_HEADER } from '~/common/constants';
import env from '~/config/env';
import { log } from '~/config/logger';

const checkHeaderValidAndReject: Middleware = async (ctx, next): Promise<void> => {
  const { request: req } = ctx;
  const secHeader = req.headers[X_SEC_HEADER];
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
