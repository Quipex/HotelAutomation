import { Context } from 'telegraf';
import putSyncBookings from '../../api/calls/putSyncBookings';
import putSyncClients from '../../api/calls/putSyncClients';
import synchronizationStatus from '../message_components/Synchronization';

async function synchronizeBookingsAndClientsAndReply(ctx: Context) {
  const { message_id: messageId } = await ctx.reply(synchronizationStatus('бронирования', 1, 3));
  await ctx.replyWithChatAction('typing');
  await putSyncBookings();
  await ctx.telegram.editMessageText(
    ctx.chat!.id,
    messageId,
    null as any,
    synchronizationStatus('клиенты', 2, 3)
  );
  await ctx.replyWithChatAction('typing');
  await putSyncClients();
  await ctx.telegram.editMessageText(
    ctx.chat!.id,
    messageId,
    null as any,
    synchronizationStatus('всё синхронизировано', 3, 3, true)
  );
  return ctx.reply('✅ Done');
}

export default synchronizeBookingsAndClientsAndReply;
