import { Context } from 'telegraf';
import { NotPrepaidMenu, NotPrepaidMenuActions } from '~@components';

const generateNotPrepaidMenuAndReply = async (ctx: Context, originalMessageId?: number) => {
  await ctx.reply(NotPrepaidMenu(), {
    reply_to_message_id: originalMessageId,
    reply_markup: { inline_keyboard: NotPrepaidMenuActions() }
  });
};

export { generateNotPrepaidMenuAndReply };
