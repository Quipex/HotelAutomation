import { Context } from 'telegraf';
import env from '~/config/env';

async function authorizeRequest(ctx: Context, next) {
  if (!ctx.chat) {
    return;
  }
  let allowedToText = false;
  if (ctx.chat.type === 'private') {
    if (env.telegramIds.includes(ctx.chat.id.toString())) {
      allowedToText = true;
    }
  }
  if (ctx.chat.type === 'channel') {
    if (env.notificationChannelId === ctx.chat.id.toString()) {
      allowedToText = true;
    }
  }
  if (allowedToText) {
    next();
  }
}

export default authorizeRequest;
