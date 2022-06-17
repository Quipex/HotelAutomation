import { AxiosError } from 'axios';
import { BookingCreationConflictError } from '~/common/errors';
import { CloudProvider } from '~/integrations/CloudProvider.interface';
import api from '../api';
import { createEasymsOrderPayload } from './helpers';

const createBooking: CloudProvider['createBooking'] = async (payload) => {
  try {
    const orderPayload = await createEasymsOrderPayload(payload);
    await api.post('api/orders/create', { data: orderPayload });
    // manually we create only one room, so it's safe to access room by the first index
    return { id: orderPayload.rooms[0].roomReservationId };
  } catch (e: unknown) {
    const { isAxiosError, response: { status } } = e as AxiosError;
    if (isAxiosError) {
      if (status === 409) {
        throw new BookingCreationConflictError(payload);
      }
    }
    throw e;
  }
};

export { createBooking };
