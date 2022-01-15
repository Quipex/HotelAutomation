import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchBookingsArriveAtAndNotLiving(unixDate: number): Promise<PmsBookingEntity[]> {
  return await api.get(`/bookings/arrive_not_living?date=${unixDate}`) as [];
}

export default fetchBookingsArriveAtAndNotLiving;
