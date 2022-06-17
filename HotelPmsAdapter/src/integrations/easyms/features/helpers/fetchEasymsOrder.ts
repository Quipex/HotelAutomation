import env from '~/config/env';
import { BookingModel } from '~/domain/bookings/BookingModel';
import { getRepository } from '~/domain/helpers/orm';
import api from '../../api';

const fetchEasymsOrder = async (bookingId) => {
  const booking = await getRepository(BookingModel).findOne({ where: { id: bookingId } });
  if (!booking) {
    throw new Error(`Booking id '${bookingId}' not found`);
  }
  const { groupId: orderId } = booking;
  const remoteOrderResp = await api.get(`api/orders/${orderId}`, { params: { organizationId: env.easyMsOrgId } });
  const remoteOrder = remoteOrderResp.data as any;
  delete remoteOrder.ngrams;
  return remoteOrder;
};

export { fetchEasymsOrder };
