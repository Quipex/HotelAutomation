## Этап 7. Поиск свободных номеров (native SQL)

**Цель:** реализовать через нативный SQL-запрос метод поиска свободных комнат по дате, длительности и числу гостей.

---

### 7.1. DTO-проекция

В пакете `com.hotel.backendservice.room.dto` создайте интерфейс-проекцию, которую напрямую вернёт Spring Data JPA из нативного запроса:

```text
public interface RoomAvailabilityDto {
    UUID getRoomId();
    String getNumber();
    String getType();
    int getCapacity();
    int getFloor();
    boolean isHasSeaView();
}
```

---

### 7.2. Добавление метода в `RoomRepository`

В `com.hotel.backendservice.room.repository.RoomRepository`:

```text
public interface RoomRepository extends JpaRepository<RoomEntity, UUID> {

    @Query(value =
      "SELECT r.id        AS room_id,  " +
      "       r.number    AS number,   " +
      "       r.type      AS type,     " +
      "       r.capacity  AS capacity, " +
      "       r.floor     AS floor,    " +
      "       r.has_sea_view AS has_sea_view " +
      "FROM room r " +
      "WHERE r.capacity >= :guests " +
      "  AND NOT EXISTS ( " +
      "    SELECT 1 FROM booking b " +
      "    WHERE b.room_id = r.id " +
      "      AND NOT (b.checkout_date < :fromDate OR b.checkin_date > :toDate) " +
      ")", 
      nativeQuery = true)
    List<RoomAvailabilityDto> findAvailableRooms(
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate")   LocalDate toDate,
        @Param("guests")   int guests
    );
}
```

- `:toDate` вычисляется в сервисе как `fromDate.plusDays(numDays - 1)`.  
- Параметры именованные через `@Param`.

---

### 7.3. Сервисный слой

В `com.hotel.backendservice.room.service.RoomService`:

```text
@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomAvailabilityDto> findAvailable(LocalDate fromDate, int numDays, int guests) {
        LocalDate toDate = fromDate.plusDays(numDays - 1);
        return roomRepository.findAvailableRooms(fromDate, toDate, guests);
    }
}
```

- Метод принимает три параметра и возвращает DTO напрямую.

---

### 7.4. REST-контроллер

В `com.hotel.backendservice.room.controller.RoomController`:

```text
@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/available")
    public List<RoomAvailabilityDto> available(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam @Min(1) @Max(365) int numDays,
        @RequestParam @Min(1) @Max(10) int guests
    ) {
        return roomService.findAvailable(fromDate, numDays, guests);
    }
}
```

- Валидация через Bean Validation (`@Min`, `@Max`).  
- `@DateTimeFormat` обеспечивает парсинг ISO-дат.

---

### 7.5. Unit-тесты

1. **Тест `RoomService`**:  
   ```text
   @ExtendWith(MockitoExtension.class)
   class RoomServiceTest {
     @Mock private RoomRepository repo;
     @InjectMocks private RoomService svc;

     @Test
     void findAvailableDelegatesToRepo() {
       LocalDate from = LocalDate.of(2025,5,1);
       int days = 3, guests = 2;
       List<RoomAvailabilityDto> expected = List.of();
       when(repo.findAvailableRooms(from, from.plusDays(days-1), guests)).thenReturn(expected);

       List<RoomAvailabilityDto> result = svc.findAvailable(from, days, guests);
       assertSame(expected, result);
       verify(repo).findAvailableRooms(from, from.plusDays(days-1), guests);
     }
   }
   ```

2. **Integration-test `RoomController`** (MockMvc):  
   ```text
   @SpringBootTest
   @AutoConfigureMockMvc
   class RoomControllerTest {
     @Autowired private MockMvc mvc;
     @MockBean private RoomService svc;

     @Test
     void availableEndpointReturnsList() throws Exception {
       RoomAvailabilityDto dto = // mock DTO impl
       when(svc.findAvailable(any(), anyInt(), anyInt()))
         .thenReturn(List.of(dto));

       mvc.perform(get("/api/rooms/available")
           .param("fromDate","2025-05-01")
           .param("numDays","3")
           .param("guests","2"))
         .andExpect(status().isOk())
         .andExpect(jsonPath("$[0].roomId").exists())
         .andExpect(jsonPath("$[0].number").value(dto.getNumber()));
     }
   }
   ```

---

### 7.6. Telegram-бот

В `telegram-bot-service/src/handlers/availabilityHandlers.ts`:

```text
export function registerAvailabilityHandlers(bot: Telegraf) {
  bot.command("available", async (ctx) => {
    const [, fromDate, numDays, guests] = ctx.message.text.split(" ");
    try {
      const res = await api.get<RoomAvailabilityDto[]>("/rooms/available", {
        params: { fromDate, numDays, guests }
      });
      const list = res.data;
      if (list.length === 0) {
        return ctx.reply("Свободных номеров не найдено");
      }
      const text = list
        .map(r => `№${r.number} (${r.capacity} чел., этаж ${r.floor}, вид ${r.hasSeaView ? "есть" : "нет"})`)
        .join("\n");
      ctx.reply(text);
    } catch {
      ctx.reply("Ошибка при запросе доступных номеров");
    }
  });
}
```

- Разбор аргументов из текста сообщения.  
- Запрос к новому эндпоинту и вывод отформатированного списка.
