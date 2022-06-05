import { CarPlateDto } from './CarPlateDto';
import { ClientDto } from './ClientDto';
import { PrepaymentRemindingsDto } from './PrepaymentRemindingsDto';
import { RoomDto } from './RoomDto';

type BookingDto = {
  id: string,
  createdAt: string,
  updatedAt: string,
  bookedAt: string,
  startDate: string,
  endDateExclusive: string,
  totalUahCoins: string,
  numberOfGuests: number | null,
  groupId: string,
  source: string,
  living: boolean,
  cancelled: boolean,
  prepaid: boolean,
  notes: string | null,
  client: ClientDto,
  room: RoomDto,
  carPlates: CarPlateDto[],
  prepaymentRemindings: PrepaymentRemindingsDto[]
};

export type { BookingDto };
