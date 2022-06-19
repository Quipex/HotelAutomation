import { Context } from 'telegraf';
import { BookingsService } from '~/api/services';
import { SynchronizationStatus } from '~@components';

const synchronizeBookingsAndClientsAndReply = async (ctx: Context) => {
  const { message_id: messageId } = await ctx.reply(SynchronizationStatus('бронирования', 1, 2));
  await ctx.replyWithChatAction('typing');
  await BookingsService.syncBookings();
  await ctx.telegram.editMessageText(
    ctx.chat!.id,
    messageId,
    null as any,
    SynchronizationStatus('всё синхронизировано', 2, 2, true)
  );
  return ctx.reply('✅ Done');
};

export { synchronizeBookingsAndClientsAndReply };
