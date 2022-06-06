import { CustomerEasyms } from './CustomerEasyms.type';
import { RoomEasyms } from './RoomEasyms.type';

type OrderEasyms = {
  // 1653410699894
  bookedAt: number;

  // JY44693959617
  id: string;

  // 446
  organizationId: number;

  customer: CustomerEasyms;
  rooms: RoomEasyms[];
  services: [];

  // easyms
  source: string;

  // ok
  status: string;
};

export type { OrderEasyms };
