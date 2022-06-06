import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { BookingModel } from '~/domain/bookings/BookingModel';

type ClientId = string;

@Entity({ name: 'clients' })
class ClientModel {
  constructor(clientModelObject?: ClientModel) {
    Object.assign(this, clientModelObject);
  }

  @PrimaryColumn('varchar', { length: 36 })
  id: ClientId;

  @OneToMany(() => BookingModel, (booking) => booking.client, { lazy: true })
  @JoinColumn({ referencedColumnName: 'clientId' })
  bookings: Promise<BookingModel[]>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'text' })
  notes?: string;

  @Column({ type: 'varchar', length: 2 })
  country?: string;

  @Column({ type: 'varchar', length: 50 })
  city?: string;

  @Column({ type: 'varchar', length: 100 })
  address?: string;

  @Column({ type: 'varchar', length: 50 })
  phone?: string;

  @Column({ type: 'varchar', length: 100 })
  email?: string;

  @Column({ type: 'varchar', length: 100 })
  fullNameRu: string;

  @Column({ type: 'varchar', length: 100 })
  fullNameUa: string;

  @Column({ type: 'varchar', length: 100 })
  fullNameEn: string;

  @Column({ type: 'varchar', length: 100 })
  fullNameOrig: string;
}

export { ClientModel };

export type { ClientId };
