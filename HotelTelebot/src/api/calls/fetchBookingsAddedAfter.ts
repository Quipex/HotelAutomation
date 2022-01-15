import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchBookingsAddedAfter(unixDate: number): Promise<PmsBookingEntity[]> {
  return await api.get(`/bookings/added?after=${unixDate}`) as [];
}

export default fetchBookingsAddedAfter;
