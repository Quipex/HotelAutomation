import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { CarPlateModel } from '~/domain/car_plates/CarPlateModel';
import { ClientModel } from '~/domain/clients/ClientModel';
import { PrepaymentRemindingsModel } from '~/domain/prepayment_remindings/PrepaymentRemindingsModel';
import { RoomModel } from '~/domain/rooms/RoomModel';

type BookingId = string;

@Entity({ name: 'bookings' })
class BookingModel {
  constructor(bookingModelObject?: BookingModel) {
    Object.assign(this, bookingModelObject);
  }

  @PrimaryColumn('varchar', { length: 36 })
  id: BookingId;

  @ManyToOne(
    () => ClientModel,
    (client) => client.bookings,
    { cascade: ['insert'], eager: true }
  )
  @JoinColumn({ name: 'clientId' })
  client: ClientModel;

  @ManyToOne(() => RoomModel, (room) => room.bookings, { eager: true })
  @JoinColumn({ name: 'realRoomNumber' })
  room: RoomModel;

  @OneToMany(() => PrepaymentRemindingsModel, (prepaymentRemindings) => prepaymentRemindings.booking, { eager: true })
  prepaymentRemindings: PrepaymentRemindingsModel[];

  @OneToMany(() => CarPlateModel, (carPlates) => carPlates.booking, { eager: true })
  carPlates: CarPlateModel[];

  @CreateDateColumn({ type: 'timestamptz', update: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', update: false })
  updatedAt: Date;

  @Column({ type: 'timestamptz' })
  bookedAt: Date;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDateExclusive: Date;

  @Column({ type: 'bigint' })
  totalUahCoins?: string;

  @Column({ type: 'int' })
  numberOfGuests?: number;

  @Column({ type: 'varchar', length: 15 })
  groupId?: string;

  @Column({ type: 'varchar', length: 15 })
  source?: string;

  @Column({ type: 'boolean' })
  living: boolean;

  @Column({ type: 'boolean' })
  cancelled: boolean;

  @Column({ type: 'boolean' })
  prepaid: boolean;

  @Column({ type: 'text' })
  notes?: string;
}

export { BookingModel };

export type { BookingId };
