import { CloudProvider } from '../../CloudProvider.interface';
import api from '../api';
import { fetchEasymsOrder } from './helpers/fetchEasymsOrder';

const cancelBooking: CloudProvider['cancelBooking'] = async (bookingId) => {
  const remoteOrder = await fetchEasymsOrder(bookingId);
  const preconditionHeaders = { 'if-match': remoteOrder.modifiedAt };
  await api.post('api/orders/cancelRoom', {
    data: { id: remoteOrder.id, roomReservationId: bookingId },
    headers: preconditionHeaders
  });
};

export { cancelBooking };
