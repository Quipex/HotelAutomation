## Этап 6. Минимальный Telegram-бот (MVP) с Unit-тестами

**Цель:** создать бота на Telegraf + TypeScript, покрыть обработчики команд unit-тестами вместо ручного тестирования.

---

### 6.1. Инициализация проекта  
- В папке `telegram-bot-service` выполнить:  
  - `npm init -y`  
  - `npm install typescript ts-node-dev jest ts-jest @types/jest --save-dev`  
- Создать `tsconfig.json` с опциями:  
  - `target: "ES2020"`, `module: "CommonJS"`, `rootDir: "src"`, `outDir: "dist"`, `strict: true`  

### 6.2. Установка зависимостей бота  
- `npm install telegraf axios dotenv`  
- `npm install @types/node @types/telegraf --save-dev`

### 6.3. Настройка Jest  
- Создать `jest.config.js` в корне `telegram-bot-service`:
  ```text
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts','js'],
    transform: { '^.+\\.ts$': 'ts-jest' },
  };
  ```
- Добавить в `package.json` скрипт  
  `"test": "jest --coverage"`

### 6.4. Конфигурация окружения  
- В `src/config.ts` читать `dotenv.config()` и экспортировать `botToken` и `backendUrl` из `process.env`

### 6.5. Структура исходников  
- `src/` содержит:  
  - `bot.ts` — инициализация Telegraf и регистрация хэндлеров  
  - Папка `handlers/` с файлами: `bookingHandlers.ts`, `syncHandlers.ts`, `availabilityHandlers.ts`  
  - `api.ts` — axios-клиент  
  - `formatter.ts` — функции форматирования сообщений

### 6.6. Написание Unit-тестов  
- **Мокать Telegraf Context и axios:**  
  - В `src/handlers/__tests__/bookingHandlers.test.ts` импортировать функцию `registerBookingHandlers` и эмулировать `ctx` с mock-методами `reply`, `replyWithMarkdown`, а axios через jest.mock.  
- **Пример теста команд `/sync`:**  
  ```text
  import { Telegraf } from 'telegraf';
  import { registerSyncHandlers } from '../syncHandlers';
  import { api } from '../../api';

  jest.mock('../../api');
  const mockApi = api as jest.Mocked<typeof api>;

  test('sync handler replies on /sync', async () => {
    const bot = new Telegraf('TEST_TOKEN');
    const ctx: any = { reply: jest.fn(), message: { text: '/sync' } };
    registerSyncHandlers(bot);
    mockApi.post.mockResolvedValue({ data: 'ok' });
    await bot.handleUpdate({ message: { text: '/sync', chat: { id: 1 } } });
    expect(ctx.reply).toHaveBeenCalledWith('Синхронизация запущена');
  });
  ```
- **Тестировать все основные хэндлеры:**  
  - `/booking <id>` — мокировать `api.get` и проверять, что `ctx.reply` вызывается с правильно форматированным текстом.  
  - `/available <date> <days> <guests>` — эмулировать ответ `api.get` и проверить вывод списка.  
- **Покрытие:** стремиться не менее 80% покрытие кода хэндлеров.

### 6.7. CI для тестов бота  
- В `.github/workflows/ci.yml` этап `test-bot` должен запускать `npm ci && npm test` в папке `telegram-bot-service`