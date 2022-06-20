import { Context } from 'telegraf';

function messageHasNoText(ctx: Context) {
  return !ctx.message?.text;
}

async function validateMessage(ctx: Context, next) {
  if (messageHasNoText(ctx)) {
    await ctx.reply('Message text is undefined', { reply_to_message_id: ctx.message?.message_id });
    return;
  }
  next();
}

export default validateMessage;
