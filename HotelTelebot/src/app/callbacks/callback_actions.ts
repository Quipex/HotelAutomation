export const cancel = 'deny';

export function textCancel() {
  return cancel;
}

export const bookingPrePaidAsk = 'bPp';

export function textBookingPrepaidAsk(bookingId: string) {
  return `${bookingPrePaidAsk}|${bookingId}`;
}

export const bookingPrePaidConfirm = 'bPpY';

export const bookingMoveList = 'bMvL';

export function textBookingMoveList(bookingId: string) {
  return `${bookingMoveList}|${bookingId}`;
}

export const bookingMoveAsk = 'bMv';

export function textBookingMoveAsk(bookingId: string, roomNumber: string) {
  return `${bookingMoveAsk}|${bookingId}|${roomNumber}`;
}

export const bookingMoveConfirm = 'bMvY';

export function textBookingMoveConfirm(bookingId: string, roomNumber: string) {
  return `${bookingMoveConfirm}|${bookingId}|${roomNumber}`;
}

export const bookingDetails = 'bD';

export function textBookingDetails(bookingId: string) {
  return `${bookingDetails}|${bookingId}`;
}

export const clientDetails = 'cD';

export function textClientDetails(clientId: string) {
  return `${clientDetails}|${clientId}`;
}

export const clientBookings = 'cB';

export function textClientBookings(clientId: string) {
  return `${clientBookings}|${clientId}`;
}

export const clientRefresh = 'cRf';

export function textClientRefresh(clientId: string) {
  return `${clientRefresh}|${clientId}`;
}

export const bookingLivingAsk = 'bLv';

export function textBookingLivingAsk(bookingId: string) {
  return `${bookingLivingAsk}|${bookingId}`;
}

export const bookingLivingConfirm = 'bLvY';

export const bookingRemindedPrepayment = 'bRp';

export function textBookingRemindedPrepayment(bookingId: string) {
  return `${bookingRemindedPrepayment}|${bookingId}`;
}

export const bookingRefresh = 'bRf';

export function textBookingRefresh(bookingId: string) {
  return `${bookingRefresh}|${bookingId}`;
}
