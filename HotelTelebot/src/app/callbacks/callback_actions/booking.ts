const prefix = (text) => `b${text}`;

const bookingPrePaidAsk = prefix('Pp');
const bookingPrePaidConfirm = prefix('PpY');

function cbPayloadBookingPrepaidAsk(bookingId: string) {
  return `${bookingPrePaidAsk}|${bookingId}`;
}

const bookingMoveList = prefix('MvL');

function cbPayloadBookingMoveList(bookingId: string) {
  return `${bookingMoveList}|${bookingId}`;
}

const bookingMoveAsk = prefix('Mv');

function cbPayloadBookingMoveAsk(bookingId: string, roomNumber: string) {
  return `${bookingMoveAsk}|${bookingId}|${roomNumber}`;
}

const bookingMoveConfirm = prefix('MvY');

function cbPayloadBookingMoveConfirm(bookingId: string, roomNumber: string) {
  return `${bookingMoveConfirm}|${bookingId}|${roomNumber}`;
}

const bookingDetails = prefix('D');

function cbPayloadBookingDetails(bookingId: string) {
  return `${bookingDetails}|${bookingId}`;
}

const bookingLivingAsk = prefix('Lv');

function cbPayloadBookingLivingAsk(bookingId: string) {
  return `${bookingLivingAsk}|${bookingId}`;
}

const bookingLivingConfirm = prefix('LvY');

const bookingRemindedPrepayment = prefix('Rp');

function cbPayloadBookingRemindedPrepayment(bookingId: string) {
  return `${bookingRemindedPrepayment}|${bookingId}`;
}

const bookingRefresh = prefix('Rf');

function cbPayloadBookingRefresh(bookingId: string) {
  return `${bookingRefresh}|${bookingId}`;
}

const bookingCancelAsk = prefix('C');

function cbPayloadBookingCancelAsk(bookingId: string) {
  return `${bookingCancelAsk}|${bookingId}`;
}

const bookingCancelConfirm = prefix('CY');

export {
  bookingDetails,
  cbPayloadBookingDetails,
  bookingMoveList,
  cbPayloadBookingMoveList,
  bookingMoveAsk,
  bookingMoveConfirm,
  cbPayloadBookingMoveConfirm,
  bookingPrePaidAsk,
  bookingPrePaidConfirm,
  cbPayloadBookingMoveAsk,
  cbPayloadBookingPrepaidAsk,
  bookingLivingAsk,
  bookingCancelAsk,
  cbPayloadBookingCancelAsk,
  bookingCancelConfirm,
  bookingLivingConfirm,
  bookingRemindedPrepayment,
  cbPayloadBookingRemindedPrepayment,
  bookingRefresh,
  cbPayloadBookingRefresh,
  cbPayloadBookingLivingAsk
};
