import { ClientTransientModel } from '~/common/types/domain/transient_models';
import { translateClientName } from '~/common/utils/translation';
import { ClientModel } from '~/domain/clients/ClientModel';

const transientClient2clientModel = (transientClient: ClientTransientModel): ClientModel => {
  const { firstName, lastName } = transientClient;
  const { fullNameOrig, fullNameEn, fullNameRu, fullNameUa } = translateClientName(firstName, lastName);

  return new ClientModel({
    ...transientClient,
    bookings: null,
    createdAt: null,
    updatedAt: null,
    fullNameEn,
    fullNameRu,
    fullNameUa,
    fullNameOrig
  });
};

export { transientClient2clientModel };
