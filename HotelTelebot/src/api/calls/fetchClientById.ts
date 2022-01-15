import api from '../api';
import PmsClientEntity from '../entities/PmsClientEntity';

async function fetchClientById(clientId: string): Promise<PmsClientEntity> {
  return await api.get(`client/${clientId}`) as PmsClientEntity;
}

export default fetchClientById;
