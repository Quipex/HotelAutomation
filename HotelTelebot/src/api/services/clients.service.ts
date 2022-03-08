import PmsClientEntity from '@entities/PmsClientEntity';
import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { rv1 } from './helpers';

async function fetchClientById(clientId: string): Promise<PmsClientEntity> {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.clients.byId$get);
  const path = withPathVariable(fullPath, clientId);
  return await api.call(path, { method }) as PmsClientEntity;
}

async function fetchClientsByName(clientName: string): Promise<PmsClientEntity[]> {
  const { path, method, compactPath: { getData } } = rv1(routesV1.clients.search$post);
  const data = getData({ name: clientName });
  return await api.call(path, { method, data }) as PmsClientEntity[];
}

async function syncClients() {
  const { path, method } = rv1(routesV1.clients.sync$put);
  await api.put(path, { method });
}

export default { fetchClientById, fetchClientsByName, syncClients };
