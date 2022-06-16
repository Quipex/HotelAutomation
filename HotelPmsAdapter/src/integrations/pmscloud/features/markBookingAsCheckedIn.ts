import { dateToUnixSeconds } from '~/common/utils/dates';
import api from '../api';

const markBookingAsCheckedIn = async (bookingId: string) => {
  await api.post(`/roomUse/${bookingId}/checkedIn`, { data: { time: dateToUnixSeconds(new Date()) } });
};

export { markBookingAsCheckedIn };
