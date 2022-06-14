const cancel = 'deny';

function cbPayloadCancel() {
  return cancel;
}

const bookingPrePaidAsk = 'bPp';

function cbPayloadBookingPrepaidAsk(bookingId: string) {
  return `${bookingPrePaidAsk}|${bookingId}`;
}

const bookingPrePaidConfirm = 'bPpY';

const bookingMoveList = 'bMvL';

function cbPayloadBookingMoveList(bookingId: string) {
  return `${bookingMoveList}|${bookingId}`;
}

const bookingMoveAsk = 'bMv';

function cbPayloadBookingMoveAsk(bookingId: string, roomNumber: string) {
  return `${bookingMoveAsk}|${bookingId}|${roomNumber}`;
}

const bookingMoveConfirm = 'bMvY';

function cbPayloadBookingMoveConfirm(bookingId: string, roomNumber: string) {
  return `${bookingMoveConfirm}|${bookingId}|${roomNumber}`;
}

const bookingDetails = 'bD';

function cbPayloadBookingDetails(bookingId: string) {
  return `${bookingDetails}|${bookingId}`;
}

const clientDetails = 'cD';

function cbPayloadClientDetails(clientId: string) {
  return `${clientDetails}|${clientId}`;
}

const clientBookings = 'cB';

function cbPayloadClientBookings(clientId: string) {
  return `${clientBookings}|${clientId}`;
}

const clientRefresh = 'cRf';

function cbPayloadClientRefresh(clientId: string) {
  return `${clientRefresh}|${clientId}`;
}

const bookingLivingAsk = 'bLv';

function cbPayloadBookingLivingAsk(bookingId: string) {
  return `${bookingLivingAsk}|${bookingId}`;
}

const bookingLivingConfirm = 'bLvY';

const bookingRemindedPrepayment = 'bRp';

function cbPayloadBookingRemindedPrepayment(bookingId: string) {
  return `${bookingRemindedPrepayment}|${bookingId}`;
}

const bookingRefresh = 'bRf';

function cbPayloadBookingRefresh(bookingId: string) {
  return `${bookingRefresh}|${bookingId}`;
}

export {
  cancel,
  cbPayloadCancel,
  bookingPrePaidAsk,
  cbPayloadBookingPrepaidAsk,
  bookingPrePaidConfirm,
  bookingMoveList,
  cbPayloadBookingMoveList,
  bookingMoveAsk,
  cbPayloadBookingMoveAsk,
  bookingMoveConfirm,
  cbPayloadBookingMoveConfirm,
  bookingDetails,
  cbPayloadBookingDetails,
  clientDetails,
  cbPayloadClientDetails,
  clientBookings,
  cbPayloadClientBookings,
  clientRefresh,
  cbPayloadClientRefresh,
  bookingLivingAsk,
  cbPayloadBookingLivingAsk,
  bookingLivingConfirm,
  bookingRemindedPrepayment,
  cbPayloadBookingRemindedPrepayment,
  bookingRefresh,
  cbPayloadBookingRefresh
};
