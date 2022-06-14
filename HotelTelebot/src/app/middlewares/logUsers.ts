import { Middleware } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { usersLog } from '~/config/logger';

const getMessage = (ctx: TelegrafContext) => {
  const { updateType, update } = ctx;
  switch (updateType) {
    case 'message': {
      return update.message.text;
    }
    case 'callback_query': {
      return `{msg_id: "${update.callback_query.message.message_id}", data: "${update.callback_query.data}"}`;
    }
    default:
      return 'Unsupported update type';
  }
};

const logUsers: Middleware<TelegrafContext> = async (ctx, next) => {
  const { from, updateType } = ctx;
  const requestMessage = getMessage(ctx);
  usersLog.info(`[user:${from.id}] '${updateType}': ${requestMessage}`, {
    user: {
      id: from.id,
      fullName: `${from.first_name} ${from.last_name}`,
      nickName: `${from.username}`
    },
    updateType,
    data: requestMessage
  });
  next();
};

export { logUsers };
