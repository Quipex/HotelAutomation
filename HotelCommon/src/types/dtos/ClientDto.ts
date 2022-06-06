type ClientDto = {
  id: string,
  createdAt: string,
  updatedAt: string,
  firstName: string,
  lastName: string,
  notes: string | null,
  country: string | null,
  city: string | null,
  address: string | null,
  phone: string | null,
  email: string | null,
  fullNameRu: string,
  fullNameUa: string,
  fullNameEn: string,
  fullNameOrig: string
};

export type { ClientDto };
