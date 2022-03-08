interface BookingCreationPayload {
  from: Date;
  to: Date;
  roomNumber: string;
  guestName: string;
}

export type {
  BookingCreationPayload
};
