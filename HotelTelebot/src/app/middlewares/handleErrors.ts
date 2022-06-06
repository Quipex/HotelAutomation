import { AxiosError } from 'axios';
import { Context } from 'telegraf';
import { sanitizeAxiosError } from '~/common/utils/web';
import { log } from '~/config/logger';

const generateAxiosErrorMessage = (err: AxiosError) => {
  const { response: { status, statusText, data } } = err;
  const brief = `<code>${status} ${statusText}</code>`;
  return brief + (data ? `\n\n${(data as any).message}` : '');
};

const handleErrors = async (err, ctx: Context) => {
  const message = err.isAxiosError ? generateAxiosErrorMessage(err) : err.message;
  await ctx.replyWithHTML(
    '☠ Got error ☠\n\n'
    + `${message}`
  );
  log.error(`Got an error for update of type '${ctx.updateType}':`, err.isAxiosError ? sanitizeAxiosError(err) : err);
};

export default handleErrors;
