import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { ClientDto } from '~/common/types';
import { rv1 } from './helpers';

const { byId$get, search$post } = routesV1.clients;

const fetchClientById = async (clientId: string) => {
  const {
    path: fullPath, method, compactPath: { withPathVariable }
  } = rv1(byId$get);
  const path = withPathVariable(fullPath, clientId);
  return await api.call(path, { method }) as ClientDto;
};

const fetchClientsByName = async (clientName: string) => {
  const {
    path, method, compactPath: { getData }
  } = rv1(search$post);
  const data = getData({ name: clientName });
  return await api.call(path, { method, data }) as ClientDto[];
};

export default { fetchClientById, fetchClientsByName };
