import { Context, Middleware } from 'telegraf';
import {
  bookingDetails,
  bookingLivingAsk,
  bookingLivingConfirm,
  bookingMoveList,
  bookingPrePaidAsk,
  bookingPrePaidConfirm,
  bookingRefresh,
  bookingRemindedPrepayment,
  cancel,
  clientBookings,
  clientDetails,
  clientRefresh
} from './callback_actions';
import { getCallbackHandler, registerActionHandler } from './CallbackHandler';
import {
  cancelAction,
  confirmBookingAndReply,
  confirmLivingAndReply,
  createConfirmationHandler,
  findClientBookings,
  refreshBooking,
  refreshClient,
  replyWithMoveBookingUsage,
  sendBookingDetails,
  sendClientDetails,
  setRemindedPrepaymentAndReply
} from './handlers';

const handleCallbackQuery: Middleware<Context> = async (ctx) => {
  const { data, message: { message_id: messageId } } = ctx.update.callback_query;
  const cbPayloadArray = data.split('|');
  const [action] = cbPayloadArray;
  const handleCallback = getCallbackHandler(action);
  if (!handleCallback) {
    Promise.reject(`Unexpected callback query action ${action}`);
  }
  await handleCallback({ ctx, cbPayloadArray, messageId });
};

registerActionHandler(cancel, cancelAction);
registerActionHandler(bookingDetails, sendBookingDetails);
registerActionHandler(bookingPrePaidAsk, createConfirmationHandler({
  actionOnConfirm: bookingPrePaidConfirm,
  messageOnConfirm: 'Предоплата'
}));
registerActionHandler(bookingPrePaidConfirm, confirmBookingAndReply);
registerActionHandler(bookingRemindedPrepayment, setRemindedPrepaymentAndReply);
registerActionHandler(bookingLivingAsk, createConfirmationHandler({
  actionOnConfirm: bookingLivingConfirm,
  messageOnConfirm: 'Проживание'
}));
registerActionHandler(bookingLivingConfirm, confirmLivingAndReply);
registerActionHandler(bookingRefresh, refreshBooking);
registerActionHandler(clientDetails, sendClientDetails);
registerActionHandler(clientRefresh, refreshClient);
registerActionHandler(clientBookings, findClientBookings);
registerActionHandler(bookingMoveList, replyWithMoveBookingUsage);

export { handleCallbackQuery };
