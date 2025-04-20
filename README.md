# Hotel Automation System

This project provides a hotel automation system with a Spring Boot backend and a Telegram bot interface.

## Project Structure

- `backend-service`: Java Spring Boot application for hotel management
- `telegram-bot-service`: TypeScript application for Telegram bot interaction

## Prerequisites

- Docker and Docker Compose
- Java 17 (for local development)
- Node.js 18 (for local development)
- PostgreSQL (for local development)

## Configuration

### Telegram Bot

To run the Telegram bot, you need to obtain a bot token from BotFather on Telegram:

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot` command
3. Follow the instructions to create a new bot
4. Copy the token provided by BotFather

Create a `.env` file in the root directory with the following content:

```
TELEGRAM_BOT_TOKEN=your_token_here
```

## Running with Docker

Build and run all services using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Backend service (Spring Boot)
- Telegram bot service

## Local Development

### Backend Service

```bash
cd backend-service
./mvnw spring-boot:run
```

### Telegram Bot Service

```bash
cd telegram-bot-service
npm install
npm run dev
```

## API Endpoints

The backend service provides the following endpoints:

- `GET /api/health`: Health check endpoint

More endpoints will be added in future phases.

## License

This project is proprietary and confidential.
