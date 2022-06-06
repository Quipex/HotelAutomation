import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { BookingModel } from '../bookings/BookingModel';

@Entity('car_plates')
class CarPlateModel {
  @PrimaryColumn({ generated: 'increment', type: 'int' })
  id: number;

  @CreateDateColumn({ type: 'timestamptz', update: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', update: false })
  updatedAt: Date;

  @ManyToOne(() => BookingModel, (booking) => booking.carPlates)
  booking: BookingModel;

  @Column('varchar', { length: 15 })
  value: string;
}

export { CarPlateModel };
