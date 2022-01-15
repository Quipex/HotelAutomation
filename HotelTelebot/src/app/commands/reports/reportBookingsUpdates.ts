import { Context } from 'telegraf';

async function reportBookingsUpdates(ctx: Context) {
  // const titleMessage = await ctx.reply('Должны были заехать вчера ⏰', { reply_to_message_id: ctx.message?.message_id });
  // await parseCommandFindBookingsAddedAfterAndReply(ctx, next, { commandText: '/cmd yesterday', messageReplyId: titleMessage.message_id });
}

export default reportBookingsUpdates;
