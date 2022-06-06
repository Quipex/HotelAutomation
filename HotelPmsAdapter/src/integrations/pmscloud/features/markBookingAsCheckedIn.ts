import { dateToUnixSeconds } from '~/common/utils/dates';
import { log } from '~/config/logger';
import api from '../api';

const markBookingAsCheckedIn = async (bookingId: string) => {
  try {
    await api.post(`/roomUse/${bookingId}/checkedIn`, { data: { time: dateToUnixSeconds(new Date()) } });
    return true;
  } catch (e) {
    log.error('Can\'t mark booking as checked in', e);
    return false;
  }
};

export { markBookingAsCheckedIn };
