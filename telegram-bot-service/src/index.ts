import dotenv from 'dotenv';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { logger } from './utils/logger';
import { setupBotCommands } from './bot/commands';

// Load environment variables
dotenv.config();

// Check for required environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  logger.error('TELEGRAM_BOT_TOKEN must be provided!');
  process.exit(1);
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://backend-service:8080/api';
const PORT = process.env.PORT || 3000;

// Create Express server for health checks
const app = express();

// Set up health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'telegram-bot-service'
  });
});

// Start the Express server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Set up bot commands and handlers
setupBotCommands(bot, BACKEND_API_URL);

// Log bot startup
logger.info('Telegram bot has been started');

// Handle errors
bot.on('polling_error', (error) => {
  logger.error('Polling error:', error);
});

// Handle graceful shutdown
const shutdown = () => {
  logger.info('Shutting down...');
  bot.stopPolling();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown); 