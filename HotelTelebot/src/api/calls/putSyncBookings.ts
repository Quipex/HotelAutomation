import api from '../api';

async function putSyncBookings() {
  await api.put('/bookings/sync');
}

export default putSyncBookings;
