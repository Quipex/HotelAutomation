/* eslint-disable no-await-in-loop */
import { Context } from 'telegraf';
import { SynchronizationStatusArgs } from '~/app/message_components/SynchronizationStatus';
import { SynchronizationStatus } from '~@components';
// noinspection ES6PreferShortImport
import { synchronizeDataGenerator } from './synchronizeDataGenerator';

const synchronizeDataAndSendStatus = async (ctx: Context) => {
  const syncIterator = synchronizeDataGenerator();
  let nextVal = syncIterator.next();
  const { message_id: messageId } = await ctx.reply(SynchronizationStatus(nextVal.value as SynchronizationStatusArgs));
  while (!nextVal.done) {
    await ctx.replyWithChatAction('typing');
    nextVal = syncIterator.next();
    if ((nextVal.value as SynchronizationStatusArgs)?.stageText) {
      await ctx.telegram.editMessageText(
        ctx.chat!.id,
        messageId,
        null as any,
        SynchronizationStatus(nextVal.value as SynchronizationStatusArgs)
      );
    }
  }
  return ctx.reply('✅ Done');
};

export { synchronizeDataAndSendStatus };
