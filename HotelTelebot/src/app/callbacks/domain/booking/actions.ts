import { composeCallbackData } from '~@callbacks/helpers';

const prefix = (text) => `b${text}`;

const bookingPrePaidAsk = prefix('Pp');
const bookingPrePaidConfirm = prefix('PpY');
const cbPayloadBookingPrepaidAsk = (bookingId: string) => `${bookingPrePaidAsk}|${bookingId}`;

const bookingMoveList = prefix('MvL');
const cbPayloadBookingMoveList = (bookingId: string) => `${bookingMoveList}|${bookingId}`;

const bookingMoveAsk = prefix('Mv');
const cbPayloadBookingMoveAsk = (bookingId: string, roomNumber: string) => {
  return `${bookingMoveAsk}|${bookingId}|${roomNumber}`;
};

const bookingMoveConfirm = prefix('MvY');
const cbPayloadBookingMoveConfirm = (bookingId: string, roomNumber: string) => {
  return `${bookingMoveConfirm}|${bookingId}|${roomNumber}`;
};

const bookingDetails = prefix('D');
const cbPayloadBookingDetails = (bookingId: string) => `${bookingDetails}|${bookingId}`;

const bookingLivingAsk = prefix('Lv');
const bookingLivingConfirm = prefix('LvY');
const cbPayloadBookingLivingAsk = (bookingId: string) => `${bookingLivingAsk}|${bookingId}`;

const bookingRemindedPrepayment = prefix('Rp');
const cbPayloadBookingRemindedPrepayment = (bookingId: string) => `${bookingRemindedPrepayment}|${bookingId}`;

const bookingRefresh = prefix('Rf');
const cbPayloadBookingRefresh = (bookingId: string) => `${bookingRefresh}|${bookingId}`;

const bookingCancelAsk = prefix('C');
const bookingCancelConfirm = prefix('CY');
const cbPayloadBookingCancelAsk = (bookingId: string) => `${bookingCancelAsk}|${bookingId}`;

const bookingShowNote = prefix('Note');
const cbPayloadBookingShowNote = (bookingId: string) => {
  return composeCallbackData(bookingShowNote, bookingId);
};

const bookingClearNote = prefix('RmNote');
const cbPayloadBookingClearNote = (bookingId: string) => {
  return composeCallbackData(bookingClearNote, bookingId);
};

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
  cbPayloadBookingLivingAsk,
  bookingShowNote,
  cbPayloadBookingShowNote,
  bookingClearNote,
  cbPayloadBookingClearNote
};
