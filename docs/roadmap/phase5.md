## Этап 5. CRUD‑сервисы для ключевых доменов

**Цель:** реализовать полный набор операций (создание, чтение, обновление, удаление) для сущностей Booking, Client и Room с использованием MapStruct для маппинга, Spring Data JPA для простых CRUD и jOOQ для сложных запросов.

---

### 5.1. DTO и MapStruct

1. **Создайте DTO‑классы** в пакетах `com.hotel.backendservice.client.dto`, `…booking.dto`, `…room.dto`:  
   - `ClientDto` (поля: id, firstName, lastName, middleName, phones, email, notes)  
   - `BookingDto` (id, clientId, roomId, checkinDate, checkoutDate, status, source, cost, notes, sourceSystemId, channelId, channelName)  
   - `RoomDto` (id, number, floor, hasSeaView, balconySide, type, maxAdults, capacity, notes)

2. **MapStruct‑мапперы** в пакетах `…client.mapper`, `…booking.mapper`, `…room.mapper`:  
   - Объявите интерфейс `@Mapper(componentModel = "spring") public interface ClientMapper { ClientDto toDto(ClientEntity e); ClientEntity toEntity(ClientDto d); }`  
   - Аналогично для `BookingMapper` и `RoomMapper`.

---

### 5.2. Репозитории

1. **Spring Data JPA** для базовых операций:
   - В `com.hotel.backendservice.client.repository`  
     `public interface ClientRepository extends JpaRepository<ClientEntity, UUID> { }`
   - В `…booking.repository`  
     `public interface BookingRepository extends JpaRepository<BookingEntity, UUID> { }`
   - В `…room.repository`  
     `public interface RoomRepository extends JpaRepository<RoomEntity, UUID> { }`

2. **jOOQ‑репозиторий** для сложных выборок:
   - В `com.hotel.backendservice.client.jooq` создайте `ClientJooqRepository` с методом  
     ```text
     public List<ClientDto> findByNameFuzzy(String name) { … }
     ```
     который с помощью DSLContext выполняет `WHERE full_name % :name` и маппит записи через `ClientMapper`.
   - Аналогично для Booking (поиск по дате, prepaid) и Room (другие фильтры) в своих пакетах `…booking.jooq`, `…room.jooq`.

---

### 5.3. Сервисы

Реализуйте сервисы в `com.hotel.backendservice.client.service`, `…booking.service`, `…room.service`:

- **ClientService**  
  - `ClientDto create(ClientDto dto)`  
  - `ClientDto update(UUID id, ClientDto dto)`  
  - `ClientDto findById(UUID id)`  
  - `List<ClientDto> searchByName(String name)` (вызывает `ClientJooqRepository.findByNameFuzzy`)

- **BookingService**  
  - `BookingDto create(BookingDto dto)`  
  - `BookingDto update(UUID id, BookingDto dto)`  
  - `void cancel(UUID id)`  
  - `BookingDto findById(UUID id)`  
  - `List<BookingDto> search(LocalDate from, Boolean prepaid, String source)` (можно через спецификации или jOOQ)

- **RoomService**  
  - `RoomDto create(RoomDto dto)`  
  - `RoomDto update(UUID id, RoomDto dto)`  
  - `RoomDto findById(UUID id)`  
  - `List<RoomDto> searchByNumber(String number)`

Во всех методах инжектить `JpaRepository`, `JooqRepository` (при необходимости) и `Mapper`.

---

### 5.4. REST‑контроллеры

Разместите в `com.hotel.backendservice.client.controller`, `…booking.controller`, `…room.controller`:

- **ClientController** `@RestController @RequestMapping("/api/clients")`  
  - `GET /api/clients/{id}` → `findById`  
  - `PATCH /api/clients/{id}` → `update`  
  - `GET /api/clients?name=` → `searchByName`

- **BookingController** `@RestController @RequestMapping("/api/bookings")`  
  - `GET /api/bookings/{id}` → `findById`  
  - `POST /api/bookings` → `create`  
  - `PATCH /api/bookings/{id}` → `update` (статусы, notes)  
  - `GET /api/bookings?from=&prepaid=&source=` → `search`

- **RoomController** `@RestController @RequestMapping("/api/rooms")`  
  - `GET /api/rooms/{id}` → `findById`  
  - `PATCH /api/rooms/{id}` → `update`  
  - `GET /api/rooms?number=` → `searchByNumber`

Все методы принимают/отдают DTO в `@RequestBody` или `@RequestParam`.

---

### 5.5. Валидация

1. На полях DTO используйте Bean Validation:  
   - `@NotNull`, `@Size(min=...)`, `@Email`, `@Pattern(...)`
2. В контроллерах ставьте `@Valid` на параметры `@RequestBody`.  
3. Обработайте ошибки в `@ControllerAdvice`, возвращая HTTP 400 с JSON:
   ```json
   {
     "timestamp": "...",
     "status": 400,
     "errors": [
       {"field":"email","message":"некорректный формат"}
     ]
   }
   ```

---

### 5.6. Тестирование

1. **Юнит‑тесты** (JUnit 5 + Mockito) для сервисов:  
   - мокать репозитории и мапперы, проверять логику create/update/search.
2. **Интеграционные тесты** для контроллеров (`@SpringBootTest` или `@WebMvcTest` + `MockMvc`):  
   - реальная в памяти H2/Postgres, прогнать сценарии CRUD и поиск.
3. **Тесты jOOQ‑репозиториев**:  
   - с инициализацией тестовой схемы, проверять SQL‑запросы.

---

### 5.7. Документация API

1. Подключите Springdoc‑OpenAPI:  
   - в `pom.xml` зависимость `springdoc-openapi-ui`.
2. Проверьте, что Swagger UI доступен по `/swagger-ui.html` с описаниями всех эндпоинтов и моделей DTO.

---

После завершения этого этапа у вас будет полностью работающее CRUD‑API для основных доменов с чистым слоем DTO, гибкими репозиториями и надёжной валидацией.