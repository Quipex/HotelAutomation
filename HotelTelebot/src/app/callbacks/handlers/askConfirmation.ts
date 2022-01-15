import { Context } from 'telegraf';
import Confirmation from '../../message_components/Confirmation';
import { textCancel } from '../callback_actions';

export async function cancelAction(ctx: Context) {
  await ctx.answerCbQuery('Отменено ❌');
  const messageId = ctx.update.callback_query.message?.message_id;
  await ctx.deleteMessage(messageId as number);
}

const messageIdPrefix = 'mId';

export function appendPrefix(messageId: number) {
  return messageIdPrefix + messageId;
}

export function extractMessageId(composedString: string) {
  if (composedString.startsWith(messageIdPrefix)) {
    return +composedString.substr(messageIdPrefix.length);
  }
  return +composedString;
}

interface ConfirmationProps {
  ctx: Context,
  messageId: number,
  action: string,
  args: string[],
  confirmationMessage: string
}

async function askForConfirmation({ ctx, messageId, action, args, confirmationMessage }: ConfirmationProps) {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(
    Confirmation(confirmationMessage),
    {
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Отмена ❌',
              callback_data: `${textCancel()}`
            },
            {
              text: 'Подтвердить ✅',
              callback_data: `${[action, ...args, appendPrefix(messageId)].join('|')}`
            }
          ]
        ]
      }
    }
  );
}

export default askForConfirmation;
