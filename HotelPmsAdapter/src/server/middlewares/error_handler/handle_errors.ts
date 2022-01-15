import { Context } from 'koa';
import { log } from '~/config/logger';

const handleErrors = async (err: unknown, ctx: Context): Promise<void> => {
  if (!(err instanceof Error)) {
    log.error('Unknown error, not an instance of Error', { err, ctx });
  }
  log.error('Unhandled error', { err, ctx });
};

export default handleErrors;
