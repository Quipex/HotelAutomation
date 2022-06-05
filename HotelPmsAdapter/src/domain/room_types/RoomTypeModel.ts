import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RoomModel } from '~/domain/rooms/RoomModel';

@Entity({ name: 'room_types' })
export class RoomTypeModel {
  @PrimaryColumn('int')
  id: number;

  @OneToMany(() => RoomModel, (room) => room.roomType, { lazy: true })
  rooms: Promise<RoomModel[]>;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column('int')
  maxAdults: number;

  @Column('int')
  preferredAdults: number;

  @Column({ type: 'int' })
  easymsId: number;

  @Column({ type: 'int' })
  pmscloudId: number;
}
