import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchBookingById(bookingId: string): Promise<PmsBookingEntity> {
  return await api.get(`booking/${bookingId}`) as PmsBookingEntity;
}

export default fetchBookingById;
