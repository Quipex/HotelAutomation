import api from '../api';

async function putRemindedPrepayment(bookingId: string) {
  await api.put('/booking/reminded_prepayment', { data: { bookingId } });
}

export default putRemindedPrepayment;
