import { Context } from 'telegraf';
import env from '../env';

async function authorizeRequest(ctx: Context, next) {
  if (ctx.chat && ctx.chat.type === 'private') {
    if (env.telegramIds.find((rId) => +rId === ctx.chat!.id)) {
      return next();
    }
  }
  return ctx.reply('Access denied');
}

export default authorizeRequest;
