import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BookingModel } from '~/domain/bookings/BookingModel';

@Entity('prepayment_remindings')
class PrepaymentRemindingsModel {
  @PrimaryColumn({ generated: 'increment', type: 'int' })
  id: number;

  @CreateDateColumn({ type: 'timestamptz', update: false })
  createdAt: Date;

  @ManyToOne(() => BookingModel, (booking) => booking.prepaymentRemindings)
  booking: BookingModel;
}

export { PrepaymentRemindingsModel };
