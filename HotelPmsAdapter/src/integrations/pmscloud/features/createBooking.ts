import { CreateBookingPayload } from '~/common/types';
import api from '../api';
import createBookingPayload from '../create_booking';

const createBooking = async (payload: CreateBookingPayload): Promise<{ id: string }> => {
  const apiPayload = createBookingPayload(payload);
  return (await api.post('roomUse', { data: apiPayload })) as { id: string };
};

export { createBooking };
