## Этап 4. Интеграция с PMS EasyMS

**Цель:** настроить надёжное взаимодействие с внешней PMS EasyMS через REST: аутентификация JWT, таймауты, retry и метрики.

### 4.1. Пакетная структура

- В корне `backend-service/src/main/java/com/hotel/backendservice/sync/` располагаем:
  - `PmsClient`  
  - `EasyMsClientRest` (реализация)

### 4.2. Зависимости

Убедитесь в `backend-service/pom.xml`, что есть:
- `spring-boot-starter-webflux`
- `spring-boot-starter-actuator`
- `spring-retry`
- `io.micrometer:micrometer-core`
- `micrometer-registry-prometheus`

### 4.3. Конфигурация в application.yml

Добавьте раздел:
```yaml
easyms:
  base-url: ${EASYMS_BASE_URL}
  auth:
    login: ${EASYMS_LOGIN}
    password: ${EASYMS_PASSWORD}
  timeouts:
    connect: 5s
    read: 10s
  retry:
    max-attempts: 3
    backoff-delay: 2s
management:
  metrics:
    export:
      prometheus:
        enabled: true
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
```

### 4.4. Bean WebClient

В `com.hotel.backendservice.config.EasyMsConfig`:

`@Configuration`  
`public class EasyMsConfig {`  
`  @Bean`  
`  public WebClient easyMsWebClient(WebClient.Builder builder,`  
`      @Value("${easyms.base-url}") String baseUrl,`  
`      @Value("${easyms.timeouts.connect}") Duration connectTimeout,`  
`      @Value("${easyms.timeouts.read}") Duration readTimeout) {`  
`    return builder`  
`      .baseUrl(baseUrl)`  
`      .clientConnector(new ReactorClientHttpConnector(`  
`        HttpClient.create()`  
`          .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, (int)connectTimeout.toMillis())`  
`          .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(readTimeout.toMillis(), TimeUnit.MILLISECONDS)))))`  
`      .build();`  
`  }`  
`}`

### 4.5. Интерфейс PmsClient

В `com.hotel.backendservice.sync`:

`public interface PmsClient {`  
`  String authenticate();`  
`  List<BookingDto> fetchNewBookings(Instant since);`  
`  BookingDto fetchBookingById(String pmsId);`  
`}`

### 4.6. Реализация EasyMsClientRest

В `com.hotel.backendservice.sync.EasyMsClientRest`:

- Инжектим `WebClient`, `MeterRegistry` и (пока заглушку) `NotificationService` как простой логгер или дефолтная реализация, например:
  ```text
  public interface NotificationService {
    void notify(String channel, String message);
  }
  @Service
  public class LoggingNotificationService implements NotificationService {
    public void notify(String channel, String message) {
      log.error("Notification [{}]: {}", channel, message);
    }
  }
  ```
- Методы:
  - `@Timed("easyms.authenticate")`
  - `@Retryable(...)` с `@Backoff`
  - в `@Recover` используем `loggingNotificationService.notify("easyms","Ошибка EasyMS: "+e.getMessage())`

### 4.7. JWT‑аутентификация

- `authenticate()` вызывает `/login` EasyMS, получает токен и сохраняет вместе с временем истечения
- Перед каждым запросом добавляем `Authorization: Bearer <token>`, при 401 — реавторизация

### 4.8. Метрики и логирование

- `@Timed("easyms.authenticate")` на методе аутентификации
- В методах `fetchNewBookings` и `fetchBookingById`:
  ```text
  Timer.Sample sample = Timer.start(registry);
  try {
    // WebClient вызов
    registry.counter("easyms.calls","endpoint","fetchNewBookings","status","success").increment();
  } catch(Exception e) {
    registry.counter("easyms.calls","endpoint","fetchNewBookings","status","error").increment();
    throw e;
  } finally {
    sample.stop(registry.timer("easyms.call.duration","endpoint","fetchNewBookings"));
  }
  ```

### 4.9. Тестирование

- **Unit‑тесты** с `MockWebServer` или `MockRestServiceServer`: проверка retry, аутентификации, `@Recover`
- **Integration‑tests**: поднять WireMock, подменить `easyms.base-url`, убедиться в поведении при ошибках

---

**Примечание:** `NotificationService` пока заменён на `LoggingNotificationService`. В следующих этапах будет реализован полноценный сервис уведомлений.