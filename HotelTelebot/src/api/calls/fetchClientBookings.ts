import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchClientBookings(clientId: string): Promise<PmsBookingEntity[]> {
  return await api.get(`/bookings/owner/${clientId}`) as [];
}

export default fetchClientBookings;
