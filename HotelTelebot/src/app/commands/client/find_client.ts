import { BriefClient, BriefClientActions } from '@components';
import { Context } from 'telegraf';
import { ClientsService } from '~/api/services';

async function parseCommandFindClientAndReply(ctx: Context) {
  const messageText = ctx.message?.text;
  if (!messageText || messageText.split(' ').length < 2) {
    await ctx.reply('Specify the search string');
    return;
  }
  const commandTokens = messageText.split(' ');
  const clients = await ClientsService.fetchClientsByName(commandTokens.slice(1).join(' '));

  const messageId = ctx.message?.message_id;
  const limitedClients = clients.slice(0, 3);
  if (clients.length > 0) {
    await ctx.reply(`🔍 Got ${clients.length} results`);
    limitedClients.forEach(async (client) => {
      await ctx.replyWithHTML(
        BriefClient(client),
        {
          reply_to_message_id: messageId,
          reply_markup:
            {
              inline_keyboard: BriefClientActions(client)
            }
        }
      );
    });
  } else {
    await ctx.reply('No results');
  }
}

export default parseCommandFindClientAndReply;
