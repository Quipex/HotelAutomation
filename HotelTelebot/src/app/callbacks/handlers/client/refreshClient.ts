import { Context } from 'telegraf';
import { sendClientById } from '@commands/client/client_by_id';

export async function refreshClient(ctx: Context, clientId: string, originalMessageId?: number) {
  await sendClientById(clientId, ctx);
  await ctx.answerCbQuery('Обновлено ✅');
  if (originalMessageId) {
    await ctx.telegram.deleteMessage(ctx.chat?.id as number, originalMessageId);
  } else {
    await ctx.deleteMessage(ctx.update.callback_query.message?.message_id);
  }
}
