import api from '../api';

async function putConfirmBooking(bookingId: string) {
  await api.put('/booking/confirm', { data: { bookingId } });
}

export default putConfirmBooking;
