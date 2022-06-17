import { ClientDto } from '~/common/types';
import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { rv1 } from './helpers';

const fetchClientById = async (clientId: string) => {
  const { path: fullPath, method, compactPath: { withPathVariable } } = rv1(routesV1.clients.byId$get);
  const path = withPathVariable(fullPath, clientId);
  return await api.call(path, { method }) as ClientDto;
};

const fetchClientsByName = async (clientName: string) => {
  const { path, method, compactPath: { getData } } = rv1(routesV1.clients.search$post);
  const data = getData({ name: clientName });
  return await api.call(path, { method, data }) as ClientDto[];
};

export default { fetchClientById, fetchClientsByName };
