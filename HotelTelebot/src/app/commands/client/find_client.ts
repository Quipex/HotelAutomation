/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { BriefClient, BriefClientActions } from '@components';
import { Context } from 'telegraf';
import { ClientsService } from '~/api/services';
import { COMMAND_CLIENT_BY_ID } from '~/common/constants';

const LIMIT_CLIENT_CARDS = 3;

async function parseCommandFindClientAndReply(ctx: Context) {
  const messageText = ctx.message?.text;
  if (!messageText || messageText.split(' ').length < 2) {
    await ctx.reply('Specify the search string');
    return;
  }
  const commandTokens = messageText.split(' ');
  const clients = await ClientsService.fetchClientsByName(commandTokens.slice(1).join(' '));

  const limitedClients = clients.slice(0, LIMIT_CLIENT_CARDS);
  if (clients.length === 0) {
    await ctx.reply('No results');
    return;
  }

  const resultsStatement = await ctx.reply(`🔍 Got ${clients.length} results`);
  for (const client of limitedClients) {
    await ctx.replyWithHTML(
      BriefClient(client),
      {
        reply_to_message_id: resultsStatement.message_id,
        reply_markup:
          {
            inline_keyboard: BriefClientActions(client)
          }
      }
    );
  }
  if (clients.length <= LIMIT_CLIENT_CARDS) {
    return;
  }
  let msg = '';
  for (let i = LIMIT_CLIENT_CARDS; i < clients.length; i += 1) {
    const client = clients[i];
    const { id: clientId, fullNameOrig } = client;
    msg += `${i + 1}. ${fullNameOrig}\n<code>/${COMMAND_CLIENT_BY_ID} ${clientId}</code>\n\n`;
  }
  await ctx.replyWithHTML(msg, { reply_to_message_id: resultsStatement.message_id });
}

export default parseCommandFindClientAndReply;
