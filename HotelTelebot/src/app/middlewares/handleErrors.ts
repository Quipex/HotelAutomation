import { AxiosError } from 'axios';
import { sanitizeAxiosError } from '~/common/utils/web';
import { log } from '~/config/logger';

const generateAxiosErrorMessage = (err: AxiosError) => {
  const { response, message } = err;
  if (!response) {
    return `No response. Error: ${message}`;
  }
  const { status, statusText, data } = response;
  const brief = `<code>${status} ${statusText}</code>`;
  return brief + (data ? `\n\n${(data as any).message}` : '');
};

const handleErrors = (fn) => async (ctx, next) => {
  try {
    await fn(ctx, next);
    await next();
  } catch (err) {
    const message = err.isAxiosError ? generateAxiosErrorMessage(err) : err.message;
    await ctx.replyWithHTML(
      '☠ Got error ☠\n\n'
      + `${message}`
    );
    log.error(`Got an error for update of type '${ctx.updateType}':`, err.isAxiosError ? sanitizeAxiosError(err) : err);
  }
};

export default handleErrors;
