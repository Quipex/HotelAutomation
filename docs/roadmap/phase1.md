## Этап 1. Базовая инфраструктура и CI

**Цель:** подготовить монорепозиторий с двумя сервисами и настроить автоматический запуск тестов.

### 1. Структура репозитория  
- Создать корневой репозиторий, в нём директории:  
  - `backend-service/`  
  - `telegram-bot-service/`  
- Файлы в корне:  
  - `docker-compose.yml` – поднимает оба сервиса и PostgreSQL  
  - `.github/workflows/ci.yml` – конфигурация GitHub Actions

### 2. `backend-service`  
- Инициализировать Spring Boot-проект (Java 17+) через Spring Initializr с зависимостями:  
  - `spring-boot-starter-web`  
  - `spring-boot-starter-data-jpa`  
  - `postgresql`  
  - `spring-boot-starter-actuator`  
  - `spring-retry`  
- Добавить `Dockerfile` в `backend-service/` для сборки образа.  
- Подключить Flyway: добавить зависимость `org.flywaydb:flyway-core` и создать ресурс  
  `src/main/resources/db/migration/V1__create_tables.sql`  
  – первая миграция для создания таблиц.

### 3. `telegram-bot-service`  
- Инициализировать Node.js/TypeScript проект в `telegram-bot-service/`:  
  - `npm init -y`  
  - `npm install typescript ts-node-dev --save-dev`  
- Добавить `Dockerfile` для сборки образа бота.  

### 4. `docker-compose.yml`  
- Описать сервисы:  
  - `backend-service` (порт 8080)  
  - `telegram-bot-service`  
  - `postgres` с томом для данных  
- Настроить сети и переменные окружения (URL БД, учётные данные).

### 5. GitHub Actions (CI)  
- Файл `.github/workflows/ci.yml` содержит job “ci” с шагами:  
  1. Checkout кода (`actions/checkout@v2`)  
  2. Сборка и тесты `backend-service`:  
     - Setup Java (`actions/setup-java`)  
     - `mvn clean test -f backend-service/pom.xml`  
  3. Сборка и тесты `telegram-bot-service`:  
     - Setup Node.js (`actions/setup-node`)  
     - `npm install` и `npm test` в папке `telegram-bot-service`  

После выполнения этого этапа у вас будет готов монорепо с базовой инфраструктурой, рабочей миграцией БД и автоматическим запуском всех тестов при каждом push.  