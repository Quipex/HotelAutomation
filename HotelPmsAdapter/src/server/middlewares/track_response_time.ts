import { RESPONSE_TIME } from '~/common/constants';

const trackResponseTime = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set(RESPONSE_TIME, `${ms}ms`);
};

export default trackResponseTime;
