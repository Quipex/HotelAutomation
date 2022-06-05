import { mapPmscloudClient2TransientClient } from '~/common/mappings/cloud_provider/pmscloud';
import { ClientPmscloud } from '~/common/types';
import { ClientTransientModel } from '~/common/types/domain/transient_models';
import { encodeObjectAsUrl } from '~/common/utils/url';
import api from '~/integrations/pmscloud/api';

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

function getUrl(name: string) {
  return `/adult?_dc=${Date.now()}&withFilter=${formFilter(name)}&sort=${getSorting()}&ajax_request=true`;
}

const fetchClientsByName = async (name = ''): Promise<ClientTransientModel[]> => {
  const pmscloudClients = (await api.get(getUrl(name), { extra: { limit: 100 } })) as ClientPmscloud[];
  return pmscloudClients.map(mapPmscloudClient2TransientClient);
};

export { fetchClientsByName };
