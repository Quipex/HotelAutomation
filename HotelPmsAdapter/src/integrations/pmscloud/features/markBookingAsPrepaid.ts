import api from '../api';

const markBookingAsPrepaid = async (bookingId: string) => {
  await api.post(`/roomUse/${bookingId}/confirmed`);
};

export { markBookingAsPrepaid };
