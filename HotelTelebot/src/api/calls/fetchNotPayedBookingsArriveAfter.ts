import api from '../api';
import PmsBookingEntity from '../entities/PmsBookingEntity';

async function fetchNotPayedBookingsArriveAfter(unixDate: number): Promise<PmsBookingEntity[]> {
  return await api.get(`/bookings/not_payed?arrive_after=${unixDate}`) as [];
}

export default fetchNotPayedBookingsArriveAfter;
