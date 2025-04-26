# Roadmap проекта: Hotel Management Automation (MVP)

Ниже приведён пошаговый план без жёстких сроков, фокус на минимально жизнеспособном продукте.

## Этап 1. Базовая инфраструктура и CI
- Создать репозитории для TelegramBotService и BackendService.
- Написать `Dockerfile` для каждого сервиса.
- Составить `docker-compose.yml` для локального запуска приложений и PostgreSQL.
- Подключить Flyway, добавить миграцию `V1__create_tables.sql` для начальной схемы.
- Настроить GitHub Actions, чтобы при пуше в `main` выполнялись только тесты (`mvn test` или аналог).

## Этап 2. Схема БД и миграции
- Спроектировать таблицы:
  - Clients, Bookings, Booking_History, Rooms, Audit_Log, Sync_Status, Notifications.
- Добавить индексы: GIN на `full_name`, b‑tree на `checkin_date`, `checkout_date`, `phone`, `email`.
- Написать миграции Flyway:
  - `V1__create_tables.sql`
  - `V2__add_indexes.sql`

## Этап 3. Интеграция с PMS
- Определить интерфейс `PmsClient` через Spring DI.
- Реализовать REST‑клиент с получением JWT по логин/пароль.
- Добавить общий таймаут и отдельные таймауты для критичных эндпоинтов.
- Написать юнит‑тесты с MockRestServiceServer.

## Этап 4. Синхронизация бронирований
- Реализовать `SynchronizationService` с `@Scheduled(fixedRate = 300000)` и Spring Retry.
- Добавить REST‑эндпоинт `POST /api/sync` для ручного запуска.
- Вести таблицу `Sync_Status` (время, статус, длительность, детали).
- При ошибках отправлять уведомление в очередь NotificationService.

## Этап 5. CRUD для ключевых сущностей
- BookingService: create, update, cancel, история (Booking_History).
- ClientService: CRUD, fuzzy‑поиск по `full_name` (pg_trgm).
- RoomService: CRUD.
- REST‑контроллеры:
  - `/api/booking/**`, `/api/bookings`
  - `/api/client/**`, `/api/clients`
  - `/api/room/**`, `/api/rooms`
- Написать юнит‑ и интеграционные тесты (Spring Boot Test).

## Этап 6. Минимальный Telegram‑бот (MVP)
- Выбрать long polling.
- Сделать `TelegramController`, маршрутизацию команд.
- Реализовать базовые команды:
  - Просмотр бронирования
  - Сводка (дашборд)
  - Ручной запуск `/sync`
- Интегрировать с BackendService через REST‑клиент.

## Этап 7. Поиск свободных номеров
- Добавить REST‑эндпоинт  
  GET /api/rooms/available?fromDate=YYYY-MM-DD&numDays=N&guests=M
- Логика:
  - Фильтрация по вместимости (`capacity >= guests`).
  - Исключение комнат с пересекающимися датами в Bookings.
- Интегрировать команду `/available` в боте.
- Написать интеграционные тесты.

## Этап 8. Отказоустойчивые уведомления
- Спроектировать таблицу `notifications`:
  - id, channel, message, status (QUEUED/SENT/FAILED), retry_count, created_at, scheduled_at, last_attempt_at, error_details.
- NotificationService внутри BackendService:
  - При событии сохранять уведомление со статусом QUEUED и `scheduled_at`.
  - Фоновый процесс (Spring Scheduler) опрашивает очередь, отправляет через Telegram API, обновляет статус.
  - Учитывать `retry_count` и фиксировать задержку (`scheduled_at` vs фактическая отправка).

## Этап 9. Аудит и ABAC
- Внедрить аннотацию `@AuditableAction` и `AuditAspect` (Spring AOP).
- Реализовать `AuditContextHolder` и запись в `Audit_Log`.
- Настроить ABAC по YML (`abac-policies.yml`) с условием на SpEL.
- Добавить REST‑эндпоинт `/api/policies/reload` и команду `/reload_abac` в боте.

## Этап 10. Безопасность и обработка ошибок
- Добавить `@ControllerAdvice` для единого формата ошибок (код, описание, traceId).
- JWT‑фильтр для REST API.
- Включить HTTPS в конфигурации Spring Boot.
- Bean Validation для DTO.
- Spring Retry для PMSIntegration.
- Дружелюбные сообщения в боте при сбоях.

## Этап 11. Мониторинг и резервное копирование
- Включить Spring Boot Actuator (health, metrics).
- Настроить EFK (Fluentd → Elasticsearch → Kibana).
- Организовать резервное копирование PostgreSQL (cron или контейнер).
- Оповещение через NotificationService при заполнении БД выше порога.

## Этап 12. Финальная подготовка и релиз
- Проверить покрытие тестами (юнит, интеграционные, E2E).
- Сборка продакшн‑Docker‑образов.
- Смоук‑тестирование в staging.
- Деплой в production через Docker Compose.
- Обновить документацию (specification.md, README).

---

Всё готово для реализации MVP без изменений в принятой архитектуре и решениях.
