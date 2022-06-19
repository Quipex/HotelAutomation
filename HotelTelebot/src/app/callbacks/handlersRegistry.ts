import { replyWithNotMarkedLivingBookings } from '~@callbacks/handlers/dashboard/replyWithNotMarkedLivingBookings';
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
  bookingRemindedPrepayment,
  cancel,
  clientBookings,
  clientDetails,
  clientRefresh,
  dashboardDayAfter,
  dashboardDayBefore,
  dashboardNotMarkedLiving,
  dashboardNotPrepaid,
  dashboardRefresh,
  dashboardUnreadNotifications
} from './callback_actions';
import { registerActionHandler } from './CallbackHandler';
import {
  cancelAction,
  confirmBookingAndReply,
  confirmCancelAndReply,
  confirmLivingAndReply,
  createConfirmationHandler,
  findClientBookings,
  refreshBooking,
  refreshClient,
  refreshDashboard,
  replyWithDashboardDayAfter,
  replyWithDashboardDayBefore,
  replyWithMoveBookingUsage,
  replyWithNotPrepaidMenu,
  replyWithUnreadNotifications,
  sendBookingDetails,
  sendClientDetails,
  setRemindedPrepaymentAndReply
} from './handlers';

registerActionHandler(cancel, cancelAction);

registerActionHandler(bookingDetails, sendBookingDetails);
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
registerActionHandler(bookingRefresh, refreshBooking);
registerActionHandler(bookingMoveList, replyWithMoveBookingUsage);
registerActionHandler(bookingCancelAsk, createConfirmationHandler({
  actionOnConfirm: bookingCancelConfirm,
  messageOnConfirm: 'Отмена бронирования ❌'
}));
registerActionHandler(bookingCancelConfirm, confirmCancelAndReply);

registerActionHandler(clientDetails, sendClientDetails);
registerActionHandler(clientRefresh, refreshClient);
registerActionHandler(clientBookings, findClientBookings);

registerActionHandler(dashboardRefresh, refreshDashboard);
registerActionHandler(dashboardDayAfter, replyWithDashboardDayAfter);
registerActionHandler(dashboardDayBefore, replyWithDashboardDayBefore);
registerActionHandler(dashboardUnreadNotifications, replyWithUnreadNotifications);
registerActionHandler(dashboardNotMarkedLiving, replyWithNotMarkedLivingBookings);
registerActionHandler(dashboardNotPrepaid, replyWithNotPrepaidMenu);
