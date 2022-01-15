import api from '../api';

interface CreationPayload {
  from: Date;
  to: Date;
  roomNumber: string;
  guestName: string;
}

async function putCreateBooking(createPayload: CreationPayload) {
  return api.put('/booking/create', { data: createPayload });
}

export default putCreateBooking;
