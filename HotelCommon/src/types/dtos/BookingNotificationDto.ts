import { BookingDto } from './BookingDto';
import { BookingNotificationChangelogLineDto } from './BookingNotificationChangelogLineDto';

type BookingNotificationDto = {
  id: number,
  createdAt: string,
  read: boolean,
  booking: BookingDto,
  changelogLines: BookingNotificationChangelogLineDto[]
};

export type { BookingNotificationDto };
