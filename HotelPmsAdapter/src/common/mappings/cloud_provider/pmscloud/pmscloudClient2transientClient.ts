import { ClientPmscloud } from '~/common/types';
import { ClientTransientModel } from '~/common/types/domain/transient_models';

const mapPmscloudClient2TransientClient = (pmscloudClient: ClientPmscloud): ClientTransientModel => {
  const { id, firstName, lastName, phone, address, city, country, email } = pmscloudClient;
  return {
    id: id.toString(),
    firstName,
    lastName,
    phone,
    email,
    city,
    country,
    address
  };
};

export { mapPmscloudClient2TransientClient };
