import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import {
  BookingNotificationChangelogLineModel
} from '../booking_notifications_changelog_lines/BookingNotificationChangelogLineModel';
import { BookingModel } from '../bookings/BookingModel';

@Entity('booking_notifications')
class BookingNotificationModel {
  @PrimaryColumn('int', { generated: 'increment', update: false, insert: false })
  id: number;

  @ManyToOne(() => BookingModel, { eager: true })
  booking: BookingModel;

  @CreateDateColumn({ type: 'timestamptz', update: false, insert: false })
  createdAt: Date;

  @Column('boolean')
  read: boolean;

  @OneToMany(
    () => BookingNotificationChangelogLineModel,
    (changelogLine) => changelogLine.bookingNotification,
    { eager: true, cascade: ['insert'] }
  )
  changelogLines: BookingNotificationChangelogLineModel[];
}

export { BookingNotificationModel };
