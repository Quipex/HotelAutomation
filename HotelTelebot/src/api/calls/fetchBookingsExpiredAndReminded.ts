import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchBookingsExpiredAndReminded(): Promise<PmsBookingEntity[]> {
  return await api.get('/bookings/expired_remind') as [];
}

export default fetchBookingsExpiredAndReminded;
