import { Context, Middleware } from 'telegraf';
import { getCallbackHandler } from './CallbackHandler';

const handleCallbackQuery: Middleware<Context> = async (ctx) => {
  const { data, message: { message_id: messageId } } = ctx.update.callback_query;
  const cbPayloadArray = data.split('|');
  const [action] = cbPayloadArray;
  const handleCallback = getCallbackHandler(action);
  if (!handleCallback) {
    Promise.reject(`Unexpected callback query action ${action}`);
  }
  await handleCallback({ ctx, cbPayloadArray, messageId });
};

export { handleCallbackQuery };
