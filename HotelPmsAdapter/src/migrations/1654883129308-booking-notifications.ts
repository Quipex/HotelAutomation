import { MigrationInterface, QueryRunner } from "typeorm"

export class bookingNotifications1654883129308 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table booking_notifications
      (
        id          serial
          constraint booking_notifications_pk
            primary key,
        "bookingId" varchar(36) not null,
        "createdAt" timestamptz default now(),
        read        bool        default false
      );
      alter table booking_notifications
        add constraint fk__bn__bookings_id foreign key ("bookingId") references bookings (id);

      create table booking_notifications_changelog_lines
      (
        id               serial
          constraint booking_notifications_changelog_lines_pk
            primary key,
        "notificationId" int not null,
        property         text not null,
        "oldVal"         text,
        "newVal"         text
      );
      alter table booking_notifications_changelog_lines
        add constraint fk__bnchl__bn_id foreign key ("notificationId") references booking_notifications (id);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table booking_notifications_changelog_lines cascade;
      drop table booking_notifications cascade;
    `)
  }

}
