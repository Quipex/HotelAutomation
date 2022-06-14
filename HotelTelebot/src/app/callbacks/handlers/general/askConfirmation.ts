import { CallbackHandler } from '@callbacks/CallbackHandler';
import { Confirmation } from '@components';
import { cbPayloadCancel } from '../../callback_actions';

const messageIdPrefix = 'mId';

const appendPrefix = (messageId: number) => messageIdPrefix + messageId;

const extractMessageId = (composedString: string) => {
  if (composedString.startsWith(messageIdPrefix)) {
    return +composedString.substring(messageIdPrefix.length);
  }
  return +composedString;
};

type CreateConfirmationHandlerFn = (args: { messageOnConfirm, actionOnConfirm }) => CallbackHandler;

const createConfirmationHandler: CreateConfirmationHandlerFn = ({ messageOnConfirm, actionOnConfirm }) => async (
  { ctx, messageId, cbPayloadArray }
) => {
  const [, ...args] = cbPayloadArray;
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(
    Confirmation(messageOnConfirm),
    {
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Отмена ❌',
              callback_data: `${cbPayloadCancel()}`
            },
            {
              text: 'Подтвердить ✅',
              callback_data: `${[actionOnConfirm, ...args, appendPrefix(messageId)].join('|')}`
            }
          ]
        ]
      }
    }
  );
};

export { createConfirmationHandler, appendPrefix, extractMessageId };
