import api from '~/api/api';
import { routesV1 } from '~/common/maps';
import { ClientDto } from '~/common/types';
import { rv1 } from './helpers';

const { byId$get, search$post, setNote$patch, note$get } = routesV1.clients;

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

const setNote = async (clientId: string, noteText: string) => {
  const { path, method, compactPath: { getData } } = rv1(setNote$patch);
  const data = getData({ id: clientId, noteText });
  await api.call(path, { method, data });
};

const getNote = async (clientId: string) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(note$get);
  const params = getQueryParams({ id: clientId });
  return (await api.call(path, { method, params })) as { notes: string };
};

export default { fetchClientById, fetchClientsByName, setNote, getNote };
