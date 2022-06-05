import { transientClient2clientModel } from '~/common/mappings/transient';
import { BookingTransientModel } from '~/common/types/domain/transient_models';
import { ClientModel } from '~/domain/clients/ClientModel';

const extractClientModelsFromTransientBookings = (transientBookings: BookingTransientModel[]): ClientModel[] => {
  return transientBookings.map(({ client }) => transientClient2clientModel(client));
};

export { extractClientModelsFromTransientBookings };
