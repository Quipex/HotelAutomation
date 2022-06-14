import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { BookingNotificationModel } from '../booking_notifications/BookingNotificationModel';

@Entity('booking_notifications_changelog_lines')
class BookingNotificationChangelogLineModel {
  @PrimaryColumn('int', { generated: 'increment', update: false, insert: false })
  id: number;

  @ManyToOne(() => BookingNotificationModel)
  @JoinColumn({ name: 'notificationId' })
  bookingNotification: BookingNotificationModel;

  @Column('text')
  property: string;

  @Column('text')
  oldVal: string;

  @Column('text')
  newVal: string;
}

export { BookingNotificationChangelogLineModel };
