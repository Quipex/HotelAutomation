import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { createConfirmationHandler } from '../general/handlers';
import {
  bookingCancelAsk,
  bookingCancelConfirm,
  bookingDetails,
  bookingLivingAsk,
  bookingLivingConfirm,
  bookingMoveList,
  bookingPrePaidAsk,
  bookingPrePaidConfirm,
  bookingRefresh,
  bookingRemindedPrepayment
} from './actions';
import {
  confirmBookingAndReply,
  cbConfirmCancelAndReply,
  confirmLivingAndReply,
  cbRefreshBooking,
  replyWithMoveBookingUsage,
  cbSendBookingDetails,
  setRemindedPrepaymentAndReply
} from './handlers';

registerActionHandler(bookingDetails, cbSendBookingDetails);
registerActionHandler(bookingPrePaidAsk, createConfirmationHandler({
  actionOnConfirm: bookingPrePaidConfirm,
  messageOnConfirm: 'Предоплата 💳'
}));
registerActionHandler(bookingPrePaidConfirm, confirmBookingAndReply);
registerActionHandler(bookingRemindedPrepayment, setRemindedPrepaymentAndReply);
registerActionHandler(bookingLivingAsk, createConfirmationHandler({
  actionOnConfirm: bookingLivingConfirm,
  messageOnConfirm: 'Проживание 🛌'
}));
registerActionHandler(bookingLivingConfirm, confirmLivingAndReply);
registerActionHandler(bookingRefresh, cbRefreshBooking);
registerActionHandler(bookingMoveList, replyWithMoveBookingUsage);
registerActionHandler(bookingCancelAsk, createConfirmationHandler({
  actionOnConfirm: bookingCancelConfirm,
  messageOnConfirm: 'Отмена бронирования ❌'
}));
registerActionHandler(bookingCancelConfirm, cbConfirmCancelAndReply);
