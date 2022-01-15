import api from '../api';

async function postMoveBookingInBatch(data) {
  return api.post('/booking/move_batch', { data });
}

export default postMoveBookingInBatch;
