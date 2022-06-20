import { Context, Middleware } from 'telegraf';

const pretendTyping: Middleware<Context> = async (ctx, next) => {
  await ctx.replyWithChatAction('typing');
  next();
};

export { pretendTyping };
