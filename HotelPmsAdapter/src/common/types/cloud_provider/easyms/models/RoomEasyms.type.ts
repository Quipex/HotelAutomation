type RoomEasyms = {
  // 1653782400000
  arrival: number;
  // 1654128000000
  departure: number;
  // 14168
  categoryId: number;
  // UAH
  currencyCode: string;
  addOns: [];
  // false
  detailed: boolean;
  guestExtraCharges: [];
  // Name surname
  guestName: string;
  // 0
  invoice: number;
  // false
  locked: boolean;
  // 3
  numberOfGuests: number;
  // 0.0
  paid: number;
  // 2029
  rateId: number;
  // uuidv4
  roomId: string;
  // $easyms uid
  roomReservationId: string;
  // "booked"
  status: string;
};

export type { RoomEasyms };
