import { Context } from 'telegraf';
import env from '../../config/env';

async function authorizeRequest(ctx: Context, next) {
  if (ctx.chat && ctx.chat.type === 'private') {
    if (env.telegramIds.find((rId) => +rId === ctx.chat!.id)) {
      next();
    }
  }
}

export default authorizeRequest;
