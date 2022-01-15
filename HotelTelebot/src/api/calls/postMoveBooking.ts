import api from '../api';

interface CreatePayload {
  bookingId: string;
  roomNumber: string;
  date: number;
}

async function postMoveBooking(createPayload: CreatePayload) {
  return api.post('/booking/move', { data: createPayload });
}

export default postMoveBooking;
