import { encodeObjectAsUrl } from 'src/common/utils/url/encodeObjectAsUrl';
import api from '~/pms_cloud/api';
import { translateClientName } from '~/common/utils/translation';
import { mapPmsClientToEntity, PmsClient, PmsClientEntity } from './ClientPmsModel';
import { findClient, saveClients, searchClients } from './ClientPmsRepository';

function formFilter(name: string) {
  const query = {
    conn: 'OR',
    params: [
      {
        field: 'lastName',
        comparison: 'like',
        type: 'string',
        value: name
      },
      {
        field: 'firstName',
        comparison: 'like',
        type: 'string',
        value: name
      }
    ]
  };
  return encodeObjectAsUrl(query);
}

function getSorting() {
  const sorting = [
    { property: 'lastName', direction: 'ASC' }
  ];
  return encodeObjectAsUrl(sorting);
}

function getUrl(name = '') {
  return `/adult?_dc=${Date.now()}&withFilter=${formFilter(name)}&sort=${getSorting()}&ajax_request=true`;
}

async function getClients(): Promise<PmsClient[]> {
  const pmsClients = (await api.get(getUrl(), { extra: { limit: 100 } })) as PmsClient[];
  const clientEntities = pmsClients
    .map(mapPmsClientToEntity)
    .map(translateClientName);
  await saveClients(clientEntities);
  return pmsClients;
}

async function findClients(name: string): Promise<PmsClientEntity[]> {
  return searchClients(name);
}

async function findClientById(id: string): Promise<PmsClientEntity | undefined> {
  return findClient(+id);
}

export default {
  getClients,
  findClients,
  findClientById
};
