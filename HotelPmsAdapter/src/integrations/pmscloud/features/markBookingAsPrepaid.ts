import { log } from '~/config/logger';
import api from '../api';

const markBookingAsPrepaid = async (bookingId: string) => {
  try {
    await api.post(`/roomUse/${bookingId}/confirmed`);
    return true;
  } catch (e) {
    log.error('Can\'t mark booking as prepaid', e);
    return false;
  }
};

export { markBookingAsPrepaid };
