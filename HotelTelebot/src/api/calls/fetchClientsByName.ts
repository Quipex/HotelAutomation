import api from '../api';
import PmsClientEntity from '../entities/PmsClientEntity';

async function fetchClientsByName(clientName: string): Promise<PmsClientEntity[]> {
  return await api.post('/clients/search', {
    data: {
      name: clientName
    }
  }) as PmsClientEntity[];
}

export default fetchClientsByName;
