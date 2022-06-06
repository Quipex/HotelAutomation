import { ClientDto } from '~/common/types';
import { dateToIsoString } from '~/common/utils/dates';
import { ClientModel } from '~/domain/clients/ClientModel';

const mapClientModel2dto = (clientModel: ClientModel): ClientDto => {
  const {
    id,
    country,
    city,
    address,
    email,
    phone,
    lastName,
    fullNameOrig,
    fullNameUa,
    fullNameRu,
    fullNameEn,
    updatedAt,
    createdAt,
    firstName,
    notes
  } = clientModel;
  return {
    id,
    createdAt: dateToIsoString(createdAt),
    updatedAt: dateToIsoString(updatedAt),
    country,
    city,
    address,
    email,
    phone,
    firstName,
    fullNameEn,
    fullNameOrig,
    fullNameUa,
    fullNameRu,
    lastName,
    notes
  };
};

export { mapClientModel2dto };
