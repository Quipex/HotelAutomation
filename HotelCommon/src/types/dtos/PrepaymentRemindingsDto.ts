import { BookingDto } from '~/types';

type PrepaymentRemindingsDto = {
  createdAt: string,
  booking?: BookingDto
};

export type { PrepaymentRemindingsDto };
