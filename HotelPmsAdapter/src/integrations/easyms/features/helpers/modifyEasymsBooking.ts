import env from '~/config/env';
import { BookingModel } from '~/domain/bookings/BookingModel';
import { getRepository } from '~/domain/helpers/orm';
import api from '~/integrations/easyms/api';

type EasymsOrder = any;

type ModifyFn = (order: EasymsOrder, bookingId: string) => EasymsOrder;

const modifyBooking = async (bookingId: string, modifyFunc: ModifyFn) => {
  const booking = await getRepository(BookingModel).findOne({ where: { id: bookingId } });
  if (!booking) {
    throw new Error(`Booking id '${bookingId}' not found`);
  }
  const { groupId: orderId } = booking;
  const remoteOrderResp = await api.get(`api/orders/${orderId}`, { params: { organizationId: env.easyMsOrgId } });
  const remoteOrder = remoteOrderResp.data as any;
  delete remoteOrder.ngrams;
  const modified = modifyFunc(remoteOrder, bookingId);
  const preconditionHeaders = { 'if-match': remoteOrder.modifiedAt };
  await api.post('api/orders/modify', { data: modified, headers: preconditionHeaders });
};

export { modifyBooking };
