import { TelegrafContext } from 'telegraf/typings/context';

type CallbackHandlerArgs = {
  ctx: TelegrafContext,
  cbPayloadArray: string[],
  messageId: number
};

type CallbackHandler = (args: CallbackHandlerArgs) => Promise<void>;
type Action = string;

const actionHandlers = new Map<Action, CallbackHandler>();

const registerActionHandler = (action: Action, handler: CallbackHandler) => {
  if (actionHandlers.get(action)) {
    throw new Error(`Action '${action}' was already registered!`);
  }
  actionHandlers.set(action, handler);
};

const getCallbackHandler = (action) => {
  return actionHandlers.get(action);
};

export type { CallbackHandler };

export { getCallbackHandler, registerActionHandler };
