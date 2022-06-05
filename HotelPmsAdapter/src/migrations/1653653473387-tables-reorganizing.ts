import { MigrationInterface, QueryRunner } from "typeorm"

export class tablesReorganizing1653653473387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
      -- CLIENTS

      create table clients
      (
        id             varchar(36)
          constraint clients_pk primary key,
        "createdAt"    timestamptz not null default NOW(),
        "updatedAt"    timestamptz not null default NOW(),
        "firstName"    varchar(50) not null,
        "lastName"     varchar(50) not null,
        notes          text,
        country        varchar(2),
        city           varchar(50),
        address        varchar(100),
        phone          varchar(50),
        email          varchar(100),
        "fullNameRu"   varchar(100),
        "fullNameUa"   varchar(100),
        "fullNameEn"   varchar(100),
        "fullNameOrig" varchar(100)
      );

      CREATE INDEX idx__clients__names ON clients ("fullNameEn", "fullNameRu", "fullNameUa", "fullNameOrig");


-- ROOM_TYPES

      create table room_types
      (
        id                serial
          constraint room_types_pk primary key,
        name              varchar(100) not null,
        "maxAdults"       int,
        "preferredAdults" int,
        "pmscloudId"      int unique,
        "easymsId"        int unique
      );


-- ROOMS

      CREATE TYPE balcony_side AS ENUM ('yard', 'sea', 'middle');

      create table rooms
      (
        "realRoomNumber" int          not null
          constraint rooms_pk primary key,
        "roomTypeId"     int          not null,
        "easymsRoomId"   varchar(36),
        "pmscloudRoomId" int,
        floor            int          not null,
        side             balcony_side not null,
        "hasSeaView"     boolean      not null,
        notes            text
      );

      alter table rooms
        add constraint fk__roomTypeId__room_types_id foreign key ("roomTypeId") references room_types (id);


-- BOOKINGS

      create table bookings
      (
        id                             varchar(36)
          constraint bookings_pk primary key,
        "clientId"                     varchar(36)   not null,
        "realRoomNumber"               int           not null,
        "createdAt"                    timestamptz   not null default NOW(),
        "updatedAt"                    timestamptz   not null default NOW(),
        "bookedAt"                     timestamptz   not null,
        "startDate"                    date          not null,
        "endDateExclusive"             date          not null,
        "totalUahCoins"                bigint,
        "numberOfGuests"               int,
        "groupId"                      varchar(15),
        source                         varchar(15),
        "remindedPrepaymentTimestamps" timestamptz[] not null default Array []::timestamptz[],
        living                         boolean       not null default false,
        cancelled                      boolean       not null default false,
        prepaid                        boolean       not null default false,
        "carPlates"                    varchar(15)[] not null default Array []::varchar[],
        notes                          text
      );

      alter table bookings
        add constraint fk__clientId__clients_id foreign key ("clientId") references clients (id);

      alter table bookings
        add constraint fk__realRoomNumber__rooms_realRoomNumber foreign key ("realRoomNumber") references rooms ("realRoomNumber");


-- BOOKING PAYMENTS

      create table booking_payments
      (
        id             serial
          constraint booking_payments_pk
            primary key,
        "bookingId"    varchar(36),
        "createdAt"    timestamptz not null default NOW(),
        notes          text,
        "paidUahCoins" bigint
      );

      alter table booking_payments
        add constraint fk__bookingId__bookings_id foreign key ("bookingId") references bookings (id);


-- BOOKING PREPAYMENT REMINDINGS

      create table prepayment_remindings
      (
        id          serial
          constraint payment_remindings_pk
            primary key,
        "bookingId" varchar(36),
        "createdAt" timestamptz not null default NOW()
      );

      alter table prepayment_remindings
        add constraint fk__bookingId__bookings_id foreign key ("bookingId") references bookings (id);

-- CAR PLATES

      create table car_plates
      (
        id          serial
          constraint car_plates_pk
            primary key,
        "bookingId" varchar(36),
        "createdAt" timestamptz not null default NOW(),
        "updatedAt" timestamptz not null default NOW(),
        value       varchar(15)
      );

      alter table car_plates
        add constraint fk__bookingId__bookings_id foreign key ("bookingId") references bookings (id);


-- TRANSFER DATA FROM EXISTING TABLES TO NEW

      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (1, 'Трехместный', 3, 3, 2, 14168);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (2, 'Двухместный', 2, 2, 1, 14167);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (3, 'Пятиместный №36', 5, 5, 4, 14169);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (4, 'Пятиместный №46', 5, 5, 32768, 14170);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (5, 'Четырехместный', 4, 4, 3, 14171);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (6, 'Пятиместный №30 2к', 5, 5, 32769, 14172);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (7, 'Резерв', 0, 0, 32770, 14173);
      INSERT INTO public.room_types (id, name, "maxAdults", "preferredAdults", "pmscloudId", "easymsId")
      VALUES (-1, 'Ремонт', 0, 0, Null, Null);

      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (1, 1, '86b6b97f-487b-4793-a8b1-80f000c21446', 23, 1, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (2, 2, 'ef6a2bb4-3e17-4014-b8d1-846cd36ba88a', 40, 1, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (3, 1, '8b83cc13-1fb8-49e7-a5a4-5adfdb9aac52', 24, 1, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (4, 1, '848e8829-740d-4813-995a-8494645f415f', 25, 1, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (5, 5, 'f171e027-cd8b-4041-9a0f-f94d33e22276', 32804, 1, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (6, 2, '1400f0f6-eb46-4347-b1d8-4c1d2945d8ed', 41, 1, 'middle', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (7, 1, 'b4cd939e-e1e5-46f5-90b9-d61e4de85738', 26, 1, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (8, 2, 'df3c2dbc-dbae-4ecc-a156-a978446917aa', 42, 1, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (9, 2, 'd5aee816-8771-452c-99a8-71755a8e7a61', 43, 1, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (10, 2, '17ed04c7-9e92-47e5-a9a1-8c088c9c924e', 44, 1, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (11, 1, '5ad09a96-0816-4404-a345-89f6fe0d10cf', 27, 1, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (12, 1, 'a27eb221-d8d2-445a-a609-bc682159dbc5', 28, 1, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (13, 2, '8661cbd2-e735-40f0-8269-f843a44872c6', 32801, 1, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (14, 1, 'ac5bb812-a1e6-4579-9b54-9992fcb3fb21', 29, 2, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (15, 1, '836bf02b-301f-476e-935d-0697e0d7fb42', 30, 2, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (16, 1, 'f8963980-3203-42ba-8b03-5b66e6d21b97', 31, 2, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (17, 5, '7662572f-160b-4dd5-8046-38ed4a8c1e1e', 32805, 2, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (18, 1, '163a5cd3-9144-4fe1-b6dd-a34e18a24109', 32, 2, 'middle', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (19, 5, '4442aa59-b0ba-4d4c-bf9a-f4939bf97199', 32806, 2, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (20, 2, '0abb6d6a-72a7-4b5f-b704-d62f47e59ce8', 32795, 2, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (21, 2, 'a72582d0-17f4-4549-a90a-5d58b4bd7881', 32796, 2, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (22, 2, '1a31c49f-c5c9-4eb6-9bd5-d02e6af5bfec', 32797, 2, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (23, 2, '74ee9828-0de3-4520-8ccc-cd8aa6a035de', 32798, 2, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (24, 1, '76ab4ad3-52be-44e2-81c3-655039131837', 33, 2, 'sea', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (25, 2, 'a27ad91c-0a37-458d-b718-d4268f3b8db7', 32799, 2, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (26, 2, '3a927354-c483-404e-a568-c44b9282f3ee', 32800, 2, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (27, 1, 'e32f18e9-e2a4-4541-be5d-f5b32c8faa48', 34, 3, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (28, 2, 'b75491be-1127-4586-9331-0b01e423699f', 45, 3, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (29, 5, '08c216b3-4d6b-4414-8877-e524177d656e', 32807, 3, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (30, 6, '4bc377a2-e5f9-482f-9660-6a1b106f85ec', 32812, 3, 'middle', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (31, 1, '77179a3a-bed4-4d72-ba62-262dfc8208fc', 35, 3, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (32, 2, '83184d16-dd52-4b01-ae5c-7eb7c2afd7b9', 46, 3, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (33, 2, '260380ec-3e28-455b-9a84-5c5079cb67b7', 47, 3, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (34, 2, '78cd6415-e996-4edd-9411-17fe8632026c', 48, 3, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (35, 2, 'fd28bcc8-4c0c-490b-a4d7-6701ba89f829', 49, 3, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (36, 3, '6270f75c-b091-4bad-8141-7844622bf8c7', 32802, 3, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (37, 1, 'a96b26a0-35cc-4b3a-ab7f-9cef5204f2aa', 36, 4, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (38, 1, 'a971a5dd-68cf-42ac-87be-4af20fe552c6', 37, 4, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (39, 7, '6a81aff9-7975-45c4-9edb-f87850d724c9', 32813, 4, 'middle', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (40, 1, 'eba28999-d60e-4e52-b73f-3b045a5f531f', 38, 4, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (41, 2, '4009782d-3c39-415f-b7c0-8131a62ec5e6', 50, 4, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (42, 2, 'b47a193c-ea7b-49a8-b3fc-90ceb3a0a3d7', 51, 4, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (43, 5, '89bce366-bf2b-4600-9973-eb0f0b1fc1b5', 32808, 4, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (44, 5, 'c52de062-5b24-41b4-bc5f-b679cfee3938', 32809, 4, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (45, 5, '6b57b864-cf4d-493e-ba03-f023093b1ff6', 32810, 5, 'yard', false, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (46, 4, '1d048bee-5e0e-41dd-a5d0-1a2b850e3ecd', 32803, 3, 'middle', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (47, 5, '62fa6613-fd91-461a-b73d-561e297fdb14', 32811, 5, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (48, 1, '51457d96-8f40-4231-920a-f5e63d3da929', 39, 5, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "easymsRoomId", "pmscloudRoomId", floor, side,
                                "hasSeaView",
                                notes)
      VALUES (49, 2, '5bcf962a-6eb8-4644-9822-f6ff23f45b53', 52, 5, 'sea', true, null);
      INSERT INTO public.rooms ("realRoomNumber", "roomTypeId", "pmscloudRoomId", floor, side, "hasSeaView")
      VALUES (-1, -1, -1, 5, 'middle', false);

      insert into clients (id, "firstName", "lastName", "fullNameRu", "fullNameUa", "fullNameEn", "fullNameOrig",
                           notes)
      VALUES ('unassigned', 'Незаасайненый', 'Человек', 'Незаасайненый Человек', 'Незаасайненый Человек',
              'Unassigned person',
              'Незаасайненый Человек', 'В старых данных бронирование не было перенесено в шахматку из-за овербукинга');

      insert into clients (id, "firstName", "lastName", notes, country, city, address, phone, email,
                           "fullNameRu", "fullNameUa", "fullNameEn", "fullNameOrig")
      select id,
             "firstName",
             "lastName",
             notes,
             country,
             city,
             address,
             phone,
             email,
             "fullNameRu",
             "fullNameUa",
             "fullNameEn",
             "fullNameOrig"
      from pms_clients_raw;

      insert into bookings (id, "clientId", "realRoomNumber", "bookedAt", "startDate", "endDateExclusive",
                            "totalUahCoins", "groupId", source, living, cancelled,
                            prepaid, notes)
      select raw.id,
             COALESCE(cl.id, 'unassigned'),
             COALESCE("realRoomNumber", -1),
             "addedDate",
             "startDate",
             "endDate",
             "cdsTotal" * 100,
             "groupId",
             "source",
             COALESCE(status like 'LIVING', false),
             COALESCE(status like 'REFUSE', false),
             COALESCE(status like 'BOOKING_WARRANTY', false),
             null
      from pms_bookings_raw raw
             left join clients cl on raw."cdsCustomerId"::varchar = cl.id;

      insert into prepayment_remindings ("bookingId", "createdAt")
      select id, "remindedPrepayment"
      from pms_bookings_raw
      where "remindedPrepayment" is not null;


-- SET UP "UPDATED_AT" TRIGGERS

      CREATE OR REPLACE FUNCTION set_updatedAt_timestamp() RETURNS TRIGGER AS
      $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg__clients__updatedAt
        BEFORE UPDATE
        ON clients
        FOR EACH ROW
      EXECUTE PROCEDURE set_updatedAt_timestamp();

      CREATE TRIGGER trg__bookings__updatedAt
        BEFORE UPDATE
        ON bookings
        FOR EACH ROW
      EXECUTE PROCEDURE set_updatedAt_timestamp();

      CREATE TRIGGER trg__car_plates__updatedAt
        BEFORE UPDATE
        ON car_plates
        FOR EACH ROW
      EXECUTE PROCEDURE set_updatedAt_timestamp();


-- SET UP HISTORY TABLE FOR BOOKINGS

      CREATE TABLE bookings__history
      (
        id      serial,
        time    timestamp DEFAULT now(),
        new_val jsonb,
        old_val jsonb
      );

      CREATE OR REPLACE FUNCTION write_bookings_history() RETURNS trigger AS
      $$
      BEGIN
        INSERT INTO bookings__history (new_val, old_val)
        VALUES (row_to_json(NEW), row_to_json(OLD));
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

      CREATE TRIGGER trg__bookings__on_any_change__write_history
        BEFORE UPDATE
        ON bookings
        FOR EACH ROW
      EXECUTE PROCEDURE write_bookings_history();


-- RECREATE 'FIND BY NAME' FUNCTION

      drop function findbyname(PMS_CLIENTS_RAW, VARCHAR);

      create function findbyname(client clients, query CHARACTER VARYING) RETURNS REAL
        LANGUAGE sql AS
      $$
      SELECT GREATEST(similarity(client."fullNameOrig", query), similarity(client."fullNameEn", query),
                      similarity(client."fullNameRu", query), similarity(client."fullNameUa", query));
      $$;


-- MOVE OLD DATA TO ANOTHER SCHEMA

      create schema legacy__pms_cloud;
      alter table pms_bookings_raw
        set schema legacy__pms_cloud;
      alter table pms_clients_raw
        set schema legacy__pms_cloud;
      alter table pms_bookings_raw_history
        set schema legacy__pms_cloud;

    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // language=PostgreSQL
    await queryRunner.query(`
      -- MOVE DATA TO THE OLD SCHEMA

      alter table legacy__pms_cloud.pms_bookings_raw
        set schema public;
      alter table legacy__pms_cloud.pms_clients_raw
        set schema public;
      alter table legacy__pms_cloud.pms_bookings_raw_history
        set schema public;
      drop schema legacy__pms_cloud;


-- RECREATE 'FIND BY NAME' FUNCTION

      drop function findbyname(CLIENTS, VARCHAR);

      create function findbyname(client PMS_CLIENTS_RAW, query CHARACTER VARYING) RETURNS REAL
        LANGUAGE sql AS
      $$
      SELECT GREATEST(similarity(client."fullNameOrig", query), similarity(client."fullNameEn", query),
                      similarity(client."fullNameRu", query), similarity(client."fullNameUa", query));
      $$;


-- DROP HISTORY TABLE FOR BOOKINGS

      DROP TRIGGER trg__bookings__on_any_change__write_history ON bookings;

      DROP FUNCTION write_bookings_history;

      DROP TABLE bookings__history;


-- DROP "UPDATED_AT" TRIGGERS

      DROP TRIGGER trg__bookings__updatedAt ON bookings;

      DROP TRIGGER trg__clients__updatedAt ON clients;

      DROP FUNCTION set_updatedAt_timestamp;


-- DROP NEW TABLES

      DROP TABLE booking_payments CASCADE;

      DROP TABLE bookings CASCADE;

      DROP TABLE rooms CASCADE;

      DROP TYPE balcony_side;

      DROP TABLE room_types CASCADE;

      DROP TABLE clients CASCADE;
    `)
  }
}
