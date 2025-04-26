## Этап 8. Отказоустойчивая система уведомлений (SENT / FAILED)

**Цель:** при каждом вызове `notify(channel, message)` сразу пытаться отправить уведомление, фиксировать в базе результат и уведомлять администратора об ошибках.

### 1. Модель данных и репозиторий
- **NotificationEntity**: поля
  - `id` (UUID)
  - `channel` (String) – например, `telegram`
  - `message` (String)
  - `status` (Enum NotificationStatus: SENT / FAILED)
  - `createdAt` (Instant)
  - `lastAttemptAt` (Instant)
  - `errorDetails` (String, nullable)
- **NotificationRepository**: наследуется от `JpaRepository<NotificationEntity, UUID>`, без дополнительных методов.

### 2. Конфигурация
- В `application.yml` или переменных окружения задать:
  - `notification.telegram.bot-token` – токен бота
  - `notification.telegram.admin-chat-id` – chat_id администратора
- Зарегистрировать HTTP-клиент (`RestTemplate` или `WebClient`) через Spring-бину.

### 3. Интерфейс и реализация сервиса
- **NotificationService**: метод `notify(String channel, String message)`
- **NotificationServiceImpl** (или аналог):
  1. Создаёт новую запись с `createdAt = now()`.
  2. Пытается отправить уведомление:
    - если канал = `telegram`, делает HTTP POST к Telegram API.
  3. В зависимости от результата:
    - при успехе ставит `status = SENT`, обновляет `lastAttemptAt`.
    - при ошибке ставит `status = FAILED`, заполняет `errorDetails`, обновляет `lastAttemptAt`, сразу же вызывает экстренный алерт для администратора.
  4. Сохраняет сущность через `NotificationRepository`.

### 4. Оповещение администратора
- При любом `FAILED` внутри `notify(...)` сразу повторно вызывает `notify("telegram", "Ошибка уведомления <id>: <errorDetails>")`, чтобы администратор получил информацию.

### 5. Метрики (Micrometer)
- Инжектить `MeterRegistry` и измерять:
  - счётчики `notifications.sent{channel}` и `notifications.failed{channel}`
  - таймер `notifications.duration{channel}` для времени выполнения отправки

### 6. Тестирование
- **Unit-тесты** для `NotificationServiceImpl`:
  - **успешный сценарий**: мокнуть HTTP-клиент так, чтобы отправка прошла, и проверить, что сохранена запись со `status = SENT`
  - **сценарий ошибки**: мокнуть HTTP-клиент с выбросом исключения и проверить, что сохранена запись со `status = FAILED` и что вызван экстренный алерт админу (две попытки отправки)
- **CI-pipeline**: обеспечить запуск `mvn test` после каждого пуша.

---

После этого каждый вызов `notify(...)` надёжно фиксируется в базе, сразу выполняется попытка отправки, и при сбое администратор получает мгновенное уведомление.
