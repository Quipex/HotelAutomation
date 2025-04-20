## Этап 4. Интеграция с PMS

**Цель:** наладить надёжную связь с внешней PMS через REST, обеспечить аутентификацию, таймауты, retry и метрики.

### 4.1 Интерфейс PmsClient  
- В пакете `com.example.hotel.sync` создать:  
  ```text
  public interface PmsClient {
      String authenticate();
      List<BookingDto> fetchNewBookings(Instant since);
      BookingDto fetchBookingById(String pmsId);
  }
  ```

### 4.2 Реализация на Spring WebClient  
- Класс `PmsClientRest` с `@Service`, в конструкторе получает через DI:  
  - `WebClient` (с общим `baseUrl`)  
  - `MeterRegistry` (для метрик)  
- Вызовы к PMS оборачивать в `@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))`

### 4.3 Конфигурация в application.yml  
- В разделе `pms` прописать параметры:  
  - `pms.base-url: https://pms.example.com/api`  
  - `pms.auth.login: ${PMS_LOGIN}`  
  - `pms.auth.password: ${PMS_PASSWORD}`  
  - `pms.timeouts.connect: 5s`  
  - `pms.timeouts.read: 10s`  
  - `pms.retry.max-attempts: 3`  
  - `pms.retry.backoff-delay: 2s`

### 4.4 JWT‑аутентификация  
- Метод `authenticate()` дергает эндпоинт `/login`, получает JWT и хранит его в памяти вместе с истечением срока.  
- Перед каждым запросом устанавливать заголовок  
  `Authorization: Bearer <token>`  
- При 401 автоматически вызывать `authenticate()` повторно.

### 4.5 Логирование и метрики  
- Аннотация `@Timed("pms.authenticate")` на методе `authenticate()`  
- В `fetchNewBookings(...)` и других методах вручную:  
  - `Timer.Sample sample = Timer.start(registry);`  
  - после успешного вызова `registry.counter("pms.calls", "endpoint","fetchNewBookings","status","success").increment();`  
  - при ошибке `registry.counter("pms.calls", "endpoint","fetchNewBookings","status","error").increment();`  
  - в `finally` `sample.stop(registry.timer("pms.call.duration","endpoint","fetchNewBookings"));`

### 4.6 Обработка ошибок и retry  
- Методы, выполняющие HTTP‑вызовы к PMS, маркировать `@Retryable`  
- При исчерпании попыток в `@Recover` вызывать  
  `notificationService.notify("telegram", "Ошибка интеграции с PMS: " + e.getMessage());`

### 4.7 Тестирование  
- **Unit‑тесты**:  
  - Мокать `WebClient` или использовать `MockRestServiceServer`  
  - Проверить: успешная аутентификация, автorefresh токена, retry при ошибках  
- **Integration‑tests**:  
  - Поднять `MockWebServer` (OkHttp) или тестовый WireMock  
  - Убедиться, что все сценарии отрабатывают корректно.

---

После реализации этого этапа PmsClient будет готов к надёжному обмену с PMS, с JWT‑авторизацией, метриками и ретраями по ошибкам.