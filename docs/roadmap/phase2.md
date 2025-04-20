## Этап 2. Проектирование схемы БД и создание миграций

**Цель:** определить все таблицы, поля и связи и сразу оформить их в виде версионированных миграционных скриптов Flyway.

### 1. Миграция `V1__create_tables.sql`  
- Создаёт таблицы:
  - **client** (`id` UUID PK, `first_name`, `last_name`, `middle_name` VARCHAR,  
    `full_name` TEXT GENERATED, `phones` TEXT[], `email` VARCHAR, `notes` TEXT,  
    `created_at` TIMESTAMP, `updated_at` TIMESTAMP)
  - **room** (`id` UUID PK, `number` VARCHAR UNIQUE, `floor` INT, `has_sea_view` BOOLEAN,  
    `balcony_side` VARCHAR, `type` VARCHAR, `max_adults`, `capacity` INT, `notes` TEXT)
  - **booking** (`id` UUID PK, `client_id` UUID FK → client(id), `room_id` UUID FK → room(id),  
    `checkin_date`, `checkout_date` DATE, `status` VARCHAR, `source` VARCHAR, `cost` NUMERIC,  
    `notes` TEXT, `created_at`, `updated_at` TIMESTAMP,  
    `source_system_id`, `channel_id`, `channel_name` VARCHAR)
  - **booking_history** (`id` BIGSERIAL PK, `booking_id` UUID FK → booking(id),  
    `field` VARCHAR, `old_value`, `new_value` TEXT, `timestamp` TIMESTAMP)
  - **payment** (`id` BIGSERIAL PK, `booking_id` UUID FK → booking(id), `amount` NUMERIC,  
    `paid_at` TIMESTAMP, `account_type`, `account_number` VARCHAR)
  - **sync_status** (`id` BIGSERIAL PK, `last_sync_at` TIMESTAMP, `status` VARCHAR,  
    `duration` BIGINT, `details` TEXT)
  - **notification** (`id` UUID PK, `channel` VARCHAR, `message` TEXT,  
    `status` VARCHAR, `created_at`, `last_attempt_at` TIMESTAMP, `error_details` TEXT)
  - **audit_actor** (`id` BIGSERIAL PK, `platform`, `user_id`, `user_name`, `user_nick`,  
    `user_agent`, `ip_address` VARCHAR, `created_at` TIMESTAMP)
  - **audit_log** (`id` BIGSERIAL PK, `timestamp` TIMESTAMP, `actor_id` BIGINT FK → audit_actor(id),  
    `action`, `object_type`, `object_id` VARCHAR, `details` JSONB)

### 2. Миграция `V2__add_indexes.sql`  
- Создаёт индексы для ускорения запросов:
  - GIN‑индекс на `client(full_name gin_trgm_ops)` и на `client(phones)`
  - B‑tree на `lower(client.email)`
  - B‑tree на `booking(checkin_date)`, `booking(checkout_date)`
  - B‑tree на `audit_log(actor_id)`
  - B‑tree на `notification(created_at)`, `notification(status)`
  - B‑tree на `payment(booking_id)`, `payment(paid_at)`

### 3. Проверка миграций  
- При старте приложения Flyway автоматически выполнит эти скрипты.  
- Локально проверить через `docker-compose up`, убедиться, что все таблицы и индексы созданы без ошибок.  

После этого схема базы готова, и можно сразу приступить к генерации JPA‑сущностей по этим таблицам.