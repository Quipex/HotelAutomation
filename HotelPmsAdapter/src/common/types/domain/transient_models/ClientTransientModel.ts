import { ClientModel } from '~/domain/clients/ClientModel';

type ClientTransientModel = Omit<ClientModel,
  'bookings' | 'createdAt' | 'updatedAt' | 'fullNameOrig' | 'fullNameRu' | 'fullNameUa' | 'fullNameEn'>;

export type { ClientTransientModel };
