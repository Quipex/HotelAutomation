import { CustomerEasyms } from './CustomerEasyms';
import { RoomEasyms } from './RoomEasyms';

type BookingEasyms = {
  bookedAt: number; // 1653410699894
  id: string; // JY44693959617
  organizationId: number; // 446
  customer: CustomerEasyms;
  rooms: RoomEasyms[];
  services: [];
  source: string; // easyms
  status: string; // ok
};

export type { BookingEasyms };
