import api from '~/integrations/easyms/api';
import { fetchEasymsOrder } from './fetchEasymsOrder';

type EasymsOrder = any;

type ModifyFn = (order: EasymsOrder, bookingId: string) => EasymsOrder;

const modifyBooking = async (bookingId: string, modifyFunc: ModifyFn) => {
  const easymsOrder = await fetchEasymsOrder(bookingId);
  const { modifiedAt, bookedAt } = easymsOrder;
  const modified = modifyFunc(easymsOrder, bookingId);
  const preconditionHeaders = { 'if-match': modifiedAt ?? bookedAt };
  await api.post('api/orders/modify', { data: modified, headers: preconditionHeaders });
};

export { modifyBooking };
