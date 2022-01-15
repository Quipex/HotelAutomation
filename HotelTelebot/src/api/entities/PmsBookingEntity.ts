export type Status = 'BOOKING_FREE' | 'BOOKING_WARRANTY' | 'REFUSE' | 'LIVING';
export type Source = 'FRONT_DESK' | 'BOOKING';

interface PmsBookingEntity {
  id: number, // 98314
  endDate: string, // 2021-07-18
  startDate: string, // 2021-07-18
  cdsCustomerBalance: number, // 9712.8
  cdsCustomerFirstName: string, // "Yuriy"
  cdsCustomerId: number, // 65542
  cdsCustomerLastName: string, // "Sah"
  cdsTotal: number, // 9712.8
  customerFirstName: string, // "Yuriy"
  customerId: number, // 65542
  customerLastName: string, // "Sah"
  groupId: number, // 65545
  groupTotal: number, // 9712.8
  groupTotalPaid: number, // 0
  moved: boolean, // false
  roomId: number, // 34
  roomTypeId: number, // 2
  source: Source,
  status: Status,
  total: number, // 0
  totalPaid: number, // 0
  type: string, // "ROOM_USE"
  realRoomNumber: number,
  addedDate: string, // 2021-07-14T11:48:25.873Z
  realRoomType: string,
  remindedPrepayment: string
}

export default PmsBookingEntity;
