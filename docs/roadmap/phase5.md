## Этап 5. CRUD‑сервисы для ключевых доменов

**Цель:** реализовать полный набор операций (create, read, update, delete) для Booking, Client и Room с DTO, маппингом через MapStruct, репозиториями JPA и jOOQ для сложных запросов, контроллерами, валидацией и тестами.

### 5.1. Сущности → DTO → MapStruct

- **DTO**  
  - `BookingDto`  
  - `ClientDto`  
  - `RoomDto`  
  — описать только поля, передаваемые по API (без JPA‑аннотаций).

- **MapStruct‑мапперы**  
  - В каждом домене создать интерфейс:  
    `@Mapper(componentModel = "spring")`  
    `public interface BookingMapper {`  
    `    BookingDto toDto(BookingEntity entity);`  
    `    BookingEntity toEntity(BookingDto dto);`  
    `}`  
  — аналогично для `ClientMapper` и `RoomMapper`.

### 5.2. Репозитории

- **JPA‑репозитории** (простые CRUD):  
  - `public interface BookingRepository extends JpaRepository<BookingEntity, UUID> {}`  
  - `public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {}`  
  - `public interface RoomRepository extends JpaRepository<RoomEntity, UUID> {}`

- **jOOQ‑репозиторий** для сложных выборок (например, fuzzy‑поиск клиентов, фильтрация бронирований):  
  ```text
  @Repository
  public class ClientJooqRepository {
      private final DSLContext dsl;
      private final ClientMapper mapper;

      public List<ClientDto> findByNameFuzzy(String name) { … }
  }
  ```

### 5.3. Сервисы

- **BookingService**  
  - `BookingDto create(BookingDto dto)`  
  - `BookingDto update(UUID id, BookingDto dto)`  
  - `void cancel(UUID id)`  
  - `BookingDto findById(UUID id)`  
  - `List<BookingDto> search(LocalDate from, Boolean prepaid, String source)`

- **ClientService**  
  - `ClientDto create(ClientDto dto)`  
  - `ClientDto update(UUID id, ClientDto dto)`  
  - `ClientDto findById(UUID id)`  
  - `List<ClientDto> searchByName(String name)` (через jOOQ‑репозиторий)

- **RoomService**  
  - `RoomDto create(RoomDto dto)`  
  - `RoomDto update(UUID id, RoomDto dto)`  
  - `RoomDto findById(UUID id)`  
  - `List<RoomDto> searchByNumber(String number)`

### 5.4. REST‑контроллеры

- **BookingController** (`@RestController @RequestMapping("/api/booking")`)  
  - `GET /{id}` → `findById`  
  - `POST /` → `create`  
  - `PATCH /{id}` → `update` (подтверждение предоплаты, перенос, отмена, notes)  
  - `GET /search?from=&prepaid=&source=` → `search`

- **ClientController** (`/api/client`)  
  - `GET /{id}`  
  - `PATCH /{id}`  
  - `GET /search?name=`

- **RoomController** (`/api/room`)  
  - `GET /{id}`  
  - `PATCH /{id}`  
  - `GET /search?number=`

### 5.5. Валидация

- **Bean Validation** на DTO:  
  - `@NotNull`, `@Size`, `@Email`, `@Pattern`  
- В контроллерах:  
  - приём `@RequestBody @Valid BookingDto dto`  
- **ControllerAdvice** для обработки ошибок валидации и возврата HTTP 400 со списком полей и сообщений

### 5.6. Тестирование

- **Юнит‑тесты** для сервисов (JUnit 5 + Mockito):  
  - проверка бизнес‑логики create/update/search  
- **Интеграционные тесты** для контроллеров (Spring MVC Test / WebTestClient):  
  - поднять in‑memory БД, прогнать CRUD‑сценарии  
- **Тесты jOOQ‑репозитория** (в том числе fuzzy‑поиск)

### 5.7. Документация API

- Подключить **Springdoc‑OpenAPI**  
- Убедиться, что все контроллеры и DTO отражены в `/swagger-ui.html`  

---

После этого этапа будет готов полноценный CRUD‑функционал по всем основным доменам с чистым слоем DTO, надежными репозиториями и полным покрытием тестами.