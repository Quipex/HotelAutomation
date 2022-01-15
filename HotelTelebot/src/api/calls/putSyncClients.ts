import api from '../api';

async function putSyncClients() {
  await api.put('/clients/sync');
}

export default putSyncClients;
