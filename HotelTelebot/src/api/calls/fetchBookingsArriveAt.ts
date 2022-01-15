import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchBookingsArriveAt(unixDate: number): Promise<PmsBookingEntity[]> {
  return await api.get(`/bookings/arrive?date=${unixDate}`) as [];
}

export default fetchBookingsArriveAt;
