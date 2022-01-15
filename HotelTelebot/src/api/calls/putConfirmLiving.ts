import api from '../api';

async function putConfirmLiving(bookingId: string) {
  return api.put('/booking/confirm_living', { data: { bookingId } });
}

export default putConfirmLiving;
