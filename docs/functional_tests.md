TL;DR:

1. Поместите настройки подключения в `application-test.yml`.
2. Создайте абстрактный класс `AbstractIntegrationTest` с единым статическим контейнером Postgres и кешированным Spring-контекстом.
3. Сделайте `TestDataLoader`, который через Spring Data-репозитории грузит дефолтные данные и чистит базу.
4. В конкретных `*IT`-классах наследуйтесь от `AbstractIntegrationTest`, инжектите нужные репозитории и `MockMvc`, прямо `save()` данные и вызывайте контроллер.

---

### 1. `application-test.yml` в `src/test/resources`

```yaml
spring:
  profiles: test
  datasource:
    driver-class-name: org.postgresql.Driver
    url: ${TEST_DB_URL}
    username: ${TEST_DB_USERNAME}
    password: ${TEST_DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
```

### 2. Абстрактный базовый класс интеграционных тестов

```java
package com.example.test;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class AbstractIntegrationTest {

    // 1) Статический контейнер поднимается ровно один раз на всю сессию JVM
    private static final PostgreSQLContainer<?> POSTGRES =
        new PostgreSQLContainer<>("postgres:13-alpine")
          .withDatabaseName("testdb")
          .withUsername("test")
          .withPassword("test");

    static {
        POSTGRES.start();
    }

    // 2) Подставляем проперти для Spring Boot
    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("TEST_DB_URL",      POSTGRES::getJdbcUrl);
        registry.add("TEST_DB_USERNAME", POSTGRES::getUsername);
        registry.add("TEST_DB_PASSWORD", POSTGRES::getPassword);
    }

    @Autowired
    protected TestDataLoader loader;

    // 3) Загружаем дефолтные данные один раз перед всеми тестами
    @BeforeAll
    void initDefaultData() {
        loader.setupDefault();
    }

    // 4) После каждого теста — чистим и заново загружаем дефолт
    @AfterEach
    void resetData() {
        loader.clearDatabase();
        loader.setupDefault();
    }
}
```

### 3. Компонент `TestDataLoader` с Spring Data-репозиториями

```java
package com.example.test;

import com.example.model.Booking;
import com.example.model.Client;
import com.example.repository.BookingRepository;
import com.example.repository.ClientRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TestDataLoader {

    private final ClientRepository  clientRepo;
    private final BookingRepository bookingRepo;

    public TestDataLoader(ClientRepository clientRepo,
                          BookingRepository bookingRepo) {
        this.clientRepo  = clientRepo;
        this.bookingRepo = bookingRepo;
    }

    /** 1) Базовые данные для всех тестов */
    @Transactional
    public void setupDefault() {
        clientRepo.save(new Client("DefaultClient", "0000000000"));
        // при необходимости: bookingRepo.save(new Booking(...));
    }

    /** 2) Полная очистка всех таблиц */
    @Transactional
    public void clearDatabase() {
        bookingRepo.deleteAllInBatch();
        clientRepo.deleteAllInBatch();
    }
}
```

### 4. Пример конкретного теста `ClientControllerIT`

```java
package com.example.client;

import com.example.model.Client;
import com.example.repository.ClientRepository;
import com.example.test.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ClientControllerIT extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ClientRepository clientRepository;

    @Test
    void whenCreateClient_thenReturnsClient() throws Exception {
        // 1) Подготовка: можно добавить специфичные данные, но не обязательно
        // clientRepository.save(new Client("Иван", "88001112233"));

        // 2) JSON-запрос к контроллеру
        String json = """
            {
              "name": "Анна",
              "phone": "88005553535"
            }
            """;

        // 3) Вызов и проверки
        mockMvc.perform(post("/clients")
                .contentType(APPLICATION_JSON)
                .content(json))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Анна"))
            .andExpect(jsonPath("$.phone").value("88005553535"));
    }
}
```

### 5. Пример `BookingControllerIT`

```java
package com.example.booking;

import com.example.model.Booking;
import com.example.model.Client;
import com.example.repository.BookingRepository;
import com.example.repository.ClientRepository;
import com.example.test.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class BookingControllerIT extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private BookingRepository bookingRepository;

    @Test
    void createBooking_shouldReturnId() throws Exception {
        // 1) Сохраняем клиента напрямую
        Client client = clientRepository.save(
            new Client("Пётр", "79991234567")
        );

        // 2) Формируем JSON, подставляя client.getId()
        String json = """
            {
              "clientId": %d,
              "date": "%s"
            }
            """.formatted(
              client.getId(),
              LocalDateTime.of(2025,7,1,10,0)
          );

        // 3) Вызов и проверка
        mockMvc.perform(post("/bookings")
                .contentType(APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.bookingId").isNumber());
    }
}
```

---

**Итоги**

* Контейнер Postgres запускается **один раз** статическим блоком.
* Spring Boot-контекст поднимается **один раз** и кешируется для всех IT.
* `TestDataLoader` через репозитории управляет дефолтными данными и очисткой.
* В тестах наследуйтесь от `AbstractIntegrationTest`, инжектите `MockMvc` и нужные репозитории, сразу `save()` нужные сущности и проверяйте HTTP-эндпоинты.

В тестах JSON–payload должен быть оформлен в виде Java Text Block — строки, обёрнутой в тройные двойные кавычки (`"""…"""`).
