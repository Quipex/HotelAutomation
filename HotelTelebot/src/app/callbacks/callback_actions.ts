export const cancel = 'deny';

export function textCancel() {
  return cancel;
}

export const bookingPrePaidAsk = 'bPp';

export function textBookingPrepaidAsk(bookingId: number) {
  return `${bookingPrePaidAsk}|${bookingId}`;
}

export const bookingPrePaidConfirm = 'bPpY';

export const bookingMoveList = 'bMvL';

export function textBookingMoveList(bookingId: number) {
  return `${bookingMoveList}|${bookingId}`;
}

export const bookingMoveAsk = 'bMv';

export function textBookingMoveAsk(bookingId: number, roomNumber: number) {
  return `${bookingMoveAsk}|${bookingId}|${roomNumber}`;
}

export const bookingMoveConfirm = 'bMvY';

export function textBookingMoveConfirm(bookingId: number, roomNumber: number) {
  return `${bookingMoveConfirm}|${bookingId}|${roomNumber}`;
}

export const bookingDetails = 'bD';

export function textBookingDetails(bookingId: number) {
  return `${bookingDetails}|${bookingId}`;
}

export const clientDetails = 'cD';

export function textClientDetails(clientId: number) {
  return `${clientDetails}|${clientId}`;
}

export const clientBookings = 'cB';

export function textClientBookings(clientId: number) {
  return `${clientBookings}|${clientId}`;
}

export const clientRefresh = 'cRf';

export function textClientRefresh(clientId: number) {
  return `${clientRefresh}|${clientId}`;
}

export const bookingLivingAsk = 'bLv';

export function textBookingLivingAsk(bookingId: number) {
  return `${bookingLivingAsk}|${bookingId}`;
}

export const bookingLivingConfirm = 'bLvY';

export const bookingRemindedPrepayment = 'bRp';

export function textBookingRemindedPrepayment(bookingId: number) {
  return `${bookingRemindedPrepayment}|${bookingId}`;
}

export const bookingRefresh = 'bRf';

export function textBookingRefresh(bookingId: number) {
  return `${bookingRefresh}|${bookingId}`;
}
