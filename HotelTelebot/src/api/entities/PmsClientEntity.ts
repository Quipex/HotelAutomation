interface PmsClientEntity {
  id: number; // 65536,
  createdDate: Date; // 1618796840;
  updatedDate: Date; // 1618796840;
  firstName: string; // 'БелИмя1';
  lastName: string; // 'БелФам1';
  patronymic: string; // null;
  dob: string; // null;
  identity: string; // null;
  country: string; // null;
  city: string; // null;
  province: string; // null;
  address: string; // null;
  fromPoH: boolean; // false;
  phone: string; // 'БелТел1';
  email: string; // null;
  language: string; // null;
  driverLicense: string; // null;
  passportNumber: string; // null;
  passportValidTill: string; // null;
  passportIssued: string; // null;
  passportIssuedBy: string; // null;
  postIndex: string; // null;
  cio: string; // null;
  entryType: string; // null;
  entryValidFrom: string; // null;
  entryValidTill: string; // null;
  entryNumber: string; // null;
  visaType: string; // null;
  carBrand: string; // null;
  carNumber: string; // null;
  listMembership: string; // null;
  membershipReason: string; // null;
  discount: number; // 0;
  notes: string; // null;
  hasPersonalData: boolean; // false;
  active: boolean; // true;
  type: string; // 'adult';
  fullNameRu: string;
  fullNameUa: string;
  fullNameEn: string;
  fullNameOrig: string;
}

export default PmsClientEntity;
