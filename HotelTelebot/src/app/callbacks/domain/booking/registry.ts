import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { createConfirmationHandler } from '../general/handlers';
import {
  bookingCancelAsk,
  bookingCancelConfirm,
  bookingClearNote,
  bookingDetails,
  bookingLivingAsk,
  bookingLivingConfirm,
  bookingMoveList,
  bookingPrePaidAsk,
  bookingPrePaidConfirm,
  bookingRefresh,
  bookingRemindedPrepayment,
  bookingShowNote
} from './actions';
import {
  cbClearBookingNote,
  cbConfirmCancelAndReply,
  cbRefreshBooking,
  cbSendBookingDetails,
  cbShowBookingNoteMenu,
  confirmBookingAndReply,
  confirmLivingAndReply,
  replyWithMoveBookingUsage,
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
registerActionHandler(bookingShowNote, cbShowBookingNoteMenu);
registerActionHandler(bookingClearNote, cbClearBookingNote);
