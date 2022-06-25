import { Context } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { ClientService } from '~/api/services';
import { DetailedClient, DetailedClientActions } from '~@components';

const sendClientById = async (clientId: string, ctx: Context, extra?: ExtraReplyMessage) => {
  const foundClient = await ClientService.fetchClientById(clientId);
  if (foundClient) {
    return ctx.replyWithHTML(DetailedClient(foundClient), {
      reply_markup: { inline_keyboard: DetailedClientActions(foundClient) },
      ...extra
    });
  }
  return ctx.reply('🔍 Not found');
};

const parseCmdFindClientById = async (ctx: Context) => {
  const messageText = ctx.message?.text;
  if (!messageText || messageText.split(' ').length <= 1) {
    return ctx.reply('❌ id missing ❌');
  }
  const id = messageText.split(' ')[1];
  return sendClientById(id, ctx);
};

export { parseCmdFindClientById, sendClientById };
