import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { RoomTypeModel } from '~/domain/room_types/RoomTypeModel';
import { BookingModel } from '../bookings/BookingModel';
import { BalconySide } from './BalconySide.enum';

@Entity({ name: 'rooms' })
export class RoomModel {
  @PrimaryColumn('int')
  realRoomNumber: number;

  @OneToMany(() => BookingModel, (booking) => booking.room, { lazy: true })
  bookings: Promise<BookingModel[]>;

  @ManyToOne(() => RoomTypeModel, (rt) => rt.rooms, { eager: true })
  roomType: RoomTypeModel;

  @Column({ type: 'varchar', length: 36 })
  easymsRoomId: string; // uuid

  @Column({ type: 'int' })
  pmscloudRoomId: number;

  @Column({ type: 'int', nullable: false })
  floor: number;

  @Column({ type: 'enum', nullable: false, enumName: 'balcony_side' })
  side: BalconySide;

  @Column({ type: 'boolean', nullable: false })
  hasSeaView: boolean;
}
