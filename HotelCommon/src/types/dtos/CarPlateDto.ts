import { BookingDto } from '~/types';

type CarPlateDto = {
  createdAt: string,
  updatedAt: string,
  value: string,
  booking: BookingDto | null
};

export type { CarPlateDto };
