import { Context } from 'telegraf';
import { SynchronizationStatus } from '@components';
import { BookingsService, ClientsService } from '~/api/services';

async function synchronizeBookingsAndClientsAndReply(ctx: Context) {
  const { message_id: messageId } = await ctx.reply(SynchronizationStatus('бронирования', 1, 3));
  await ctx.replyWithChatAction('typing');
  await BookingsService.syncBookings();
  await ctx.telegram.editMessageText(
    ctx.chat!.id,
    messageId,
    null as any,
    SynchronizationStatus('клиенты', 2, 3)
  );
  await ctx.replyWithChatAction('typing');
  await ClientsService.syncClients();
  await ctx.telegram.editMessageText(
    ctx.chat!.id,
    messageId,
    null as any,
    SynchronizationStatus('всё синхронизировано', 3, 3, true)
  );
  return ctx.reply('✅ Done');
}

export default synchronizeBookingsAndClientsAndReply;
