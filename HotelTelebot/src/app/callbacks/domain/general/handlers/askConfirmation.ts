import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { appendPrefix } from '~@callbacks/helpers';
import { Confirmation } from '~@components';
import { cbPayloadCancel } from '../actions';

type CreateConfirmationHandlerFn = (args: { messageOnConfirm, actionOnConfirm }) => CallbackHandler;

const createConfirmationHandler: CreateConfirmationHandlerFn = ({ messageOnConfirm, actionOnConfirm }) => async (
  { ctx, messageId, cbPayloadArray }
) => {
  const [, ...args] = cbPayloadArray;
  await ctx.answerCbQuery();
  const cancelBtn = {
    text: 'Отмена',
    callback_data: `${cbPayloadCancel()}`
  };
  const confirmBtn = {
    text: 'Подтвердить ✅',
    callback_data: `${[actionOnConfirm, ...args, appendPrefix(messageId)].join('|')}`
  };
  await ctx.replyWithHTML(
    Confirmation(messageOnConfirm),
    {
      reply_to_message_id: messageId,
      reply_markup: {
        inline_keyboard: [[cancelBtn, confirmBtn]]
      }
    }
  );
};

export { createConfirmationHandler };
