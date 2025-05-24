## Этап 3. Генерация JPA‑сущностей и репозиториев

**Цель:** на основе таблиц из миграций создать Java‑классы сущностей и интерфейсы репозиториев для CRUD‑операций.

### 1. Пакетная структура (slices)

- **com.example.hotel.client**  
  • `ClientEntity`  
  • `ClientRepository`  
- **com.example.hotel.room**  
  • `RoomEntity`  
  • `RoomRepository`  
- **com.example.hotel.booking**  
  • `BookingEntity`  
  • `BookingHistoryEntity`  
  • `BookingRepository`  
  • `BookingHistoryRepository`  
- **com.example.hotel.payment**  
  • `PaymentEntity`  
  • `PaymentRepository`  
- **com.example.hotel.sync**  
  • `SyncStatusEntity`  
  • `SyncStatusRepository`  
- **com.example.hotel.notification**  
  • `NotificationEntity`  
  • `NotificationRepository`  
- **com.example.hotel.audit**  
  • `AuditActorEntity`  
  • `AuditLogEntity`  
  • `AuditActorRepository`  
  • `AuditLogRepository`  
- **com.example.hotel.settings**  
- **com.example.hotel.security**  

### 2. Пример `ClientEntity`

В пакете `com.example.hotel.client`:

```text
@Entity
@Table(name = "client")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClientEntity {
    @Id
    private UUID id;

    private String firstName;
    private String lastName;
    private String middleName;

    @Column(name = "full_name", insertable = false, updatable = false)
    private String fullName;

    @Column(columnDefinition = "text[]")
    private String[] phones;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
```

- Массив телефонов хранится в поле `phones` с аннотацией  
  `@Column(columnDefinition = "text[]")`.  
- Поля `createdAt` и `updatedAt` автоматически заполняются Hibernate через  
  `@CreationTimestamp`/`@UpdateTimestamp`.

### 3. Пример `BookingEntity`

В пакете `com.example.hotel.booking`:

```text
@Entity
@Table(name = "booking")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookingEntity {
    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private RoomEntity room;

    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    private String status;
    private String source;
    private BigDecimal cost;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    private String sourceSystemId;
    private String channelId;
    private String channelName;
}
```

- Связи `@ManyToOne` на `ClientEntity` и `RoomEntity`.  
- Мета‑поля `sourceSystemId`, `channelId`, `channelName` хранят ID и имя канала.

### 4. Репозитории

Для каждой сущности достаточно интерфейса, например:

```text
public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {
    // при необходимости добавляем кастомные методы
}
```

```text
public interface BookingRepository extends JpaRepository<BookingEntity, UUID> {
    // можно добавить @Query или Spring Data Specifications
}
```

### 5. Проверка

1. Убедиться, что Spring Boot при старте автоматически сканирует пакеты и создает все таблицы через Flyway.  
2. Запустить `docker compose up`, проверить, что приложение поднимается без ошибок и JPA‑репозитории готовы к использованию.  

---

После завершения этого этапа у вас будет полный набор JPA‑сущностей и репозиториев для работы с данными. Дальше переходим к интеграции с PMS (Этап 4).
